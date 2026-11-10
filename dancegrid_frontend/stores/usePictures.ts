import { create } from "zustand";
import { DancerPosition, Picture, Role } from "../components/types";
import { getChoreo, updatePictures } from "@/api/choreos";

interface PicturesState {
  choreoId: string | null;
  pictures: Picture[];
  isLoading: boolean;
  error: string | null;
  setChoreoId: (id: string | null) => void;
  resetPictures: () => void;
  fetchPictures: (choreoId: string) => Promise<Picture[] | undefined>;
  syncWithBackend: (pics?: Picture[]) => Promise<void>;
  addPicture: (coordinates: DancerPosition[]) => Promise<void>;
  updateCoordinate: (id: string, coordinate: DancerPosition) => void;
  updateX: (id: string, coupleNumber: number, role: Role, x: number) => void;
  updateY: (id: string, coupleNumber: number, role: Role, y: number) => void;
  updateComment: (id: string, comment: string) => void;
  updateTitle: (id: string, title: string) => void;
  reorderPicture: (id: string, previd: string, nextid: string) => Promise<void>;
  deletePicture: (id: string) => Promise<void>;
}

const usePictures = create<PicturesState>()((set, get) => ({
  choreoId: null,
  pictures: [],
  isLoading: false,
  error: null,

  setChoreoId: (id: string | null) => set({ choreoId: id }),

  resetPictures: () =>
    set({ choreoId: null, pictures: [], error: null, isLoading: false }),

  syncWithBackend: async (picsOverride?: Picture[]) => {
    const { choreoId } = get();
    if (!choreoId) return;
    const toSend = picsOverride ?? get().pictures;
    try {
      await updatePictures(choreoId, { pictures: toSend });
    } catch (err: any) {
      console.error("Failed to sync pictures with backend:", err);
      throw err;
    }
  },

  fetchPictures: async (choreoId: string) => {
    if (!choreoId) return;
    set({ choreoId, isLoading: true, error: null });
    try {
      const choreo = await getChoreo(choreoId);
      const data =
        choreo?.pictures ||
        choreo?.choreo?.pictures ||
        choreo?.data?.pictures ||
        [];
      set({ pictures: data, isLoading: false });
      return data;
    } catch (err: any) {
      console.error("Failed to fetch pictures:", err);
      set({
        error: err?.message || "Failed to load pictures",
        isLoading: false,
      });
    }
  },

  addPicture: async (coordinates: DancerPosition[]) => {
    const state = get();
    const orderNumber =
      Math.max(
        0,
        state.pictures
          .map((p: Picture) => p.order)
          .reduce((a: number, b: number) => Math.max(a, b), 0),
      ) + 1;
    const id = Math.random().toString(36).slice(2, 9);
    const newPic: Picture = {
      coordinates: coordinates || [],
      order: orderNumber,
      id,
      title: "",
    };
    const nextPictures = [...state.pictures, newPic];
    set({ pictures: nextPictures });
    await get().syncWithBackend(nextPictures);
  },

  reorderPicture: async (id: string, previd: string, nextid: string) => {
    const state = get();
    const prevPic = state.pictures.find((p) => p.id === previd);
    const nextPic = state.pictures.find((p) => p.id === nextid);
    if (!prevPic || !nextPic) {
      throw new Error("Picture not found");
    }
    const newOrder = (prevPic.order + nextPic.order) / 2;
    const nextPictures = state.pictures.map((p) => {
      if (p.id === id) {
        return { ...p, order: newOrder };
      }
      return p;
    });
    set({ pictures: nextPictures });
    await get().syncWithBackend(nextPictures);
  },

  updateComment: (id: string, comment: string) => {
    set((state: PicturesState) => ({
      pictures: state.pictures.map((p) =>
        p.id === id ? { ...p, comment } : p,
      ),
    }));
  },

  updateTitle: (id: string, title: string) => {
    set((state: PicturesState) => ({
      pictures: state.pictures.map((p) => (p.id === id ? { ...p, title } : p)),
    }));
  },

  updateCoordinate: (id: string, coordinate: DancerPosition) => {
    set((state: PicturesState) => ({
      pictures: state.pictures.map((p) => {
        if (p.id !== id) return p;

        const exists = p.coordinates.some(
          (c) =>
            c.coupleNumber === coordinate.coupleNumber &&
            c.role === coordinate.role,
        );

        const nextCoords = exists
          ? p.coordinates.map((c) =>
              c.coupleNumber === coordinate.coupleNumber &&
              c.role === coordinate.role
                ? { ...c, x: coordinate.x, y: coordinate.y }
                : c,
            )
          : [...p.coordinates, coordinate];

        return { ...p, coordinates: nextCoords };
      }),
    }));
  },

  updateX: (id: string, coupleNumber: number, role: Role, x: number) => {
    set((state: PicturesState) => ({
      pictures: state.pictures.map((p) => {
        if (p.id !== id) return p;

        const exists = p.coordinates.some(
          (c) => c.coupleNumber === coupleNumber && c.role === role,
        );

        const nextCoords = exists
          ? p.coordinates.map((c) =>
              c.coupleNumber === coupleNumber && c.role === role
                ? { ...c, x }
                : c,
            )
          : [...p.coordinates, { coupleNumber, role, x, y: 0 }];

        return { ...p, coordinates: nextCoords };
      }),
    }));
  },

  updateY: (id: string, coupleNumber: number, role: Role, y: number) => {
    set((state: PicturesState) => ({
      pictures: state.pictures.map((p) => {
        if (p.id !== id) return p;

        const exists = p.coordinates.some(
          (c) => c.coupleNumber === coupleNumber && c.role === role,
        );

        const nextCoords = exists
          ? p.coordinates.map((c) =>
              c.coupleNumber === coupleNumber && c.role === role
                ? { ...c, y }
                : c,
            )
          : [...p.coordinates, { coupleNumber, role, x: 0, y }];

        return { ...p, coordinates: nextCoords };
      }),
    }));
  },

  deletePicture: async (id: string) => {
    const nextPictures = get().pictures.filter((p: Picture) => p.id !== id);
    set({ pictures: nextPictures });
    await get().syncWithBackend(nextPictures);
  },
}));

export default usePictures;
