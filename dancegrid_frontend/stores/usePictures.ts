import { create } from "zustand";
import { DancerPosition, Picture, Role } from "../components/types";
import { updatePictures } from "@/api/choreos";

interface PicturesState {
  choreoId: string | null;
  pictures: Picture[];
  // Loading (filled by loadChoreo in choreoSession.ts)
  isLoading: boolean;
  error: string | null;
  // Saving
  isSaving: boolean;
  isDirty: boolean; //Local state differs from the backend
  saveError: string | null;

  setChoreoId: (id: string | null) => void;
  resetPictures: () => void;
  beginLoad: (id: string) => void;
  hydrate: (choreo: { pictures?: Picture[] } | null | undefined) => void;
  failLoad: (message: string) => void;
  // Local edits (never touch the backend).
  addPicture: (coordinates: DancerPosition[]) => string;
  updateCoordinate: (id: string, coordinate: DancerPosition) => void;
  updateX: (id: string, coupleNumber: number, role: Role, x: number) => void;
  updateY: (id: string, coupleNumber: number, role: Role, y: number) => void;
  updateComment: (id: string, comment: string) => void;
  updateTitle: (id: string, title: string) => void;
  reorderPicture: (id: string, previd: string, nextid: string) => void;
  deletePicture: (id: string) => void;
  renumberCouple: (from: number, to: number) => void;
  removeCouple: (number: number) => void;
  // Saves all pictures at once. Resolves to true on success.
  savePictures: () => Promise<boolean>;
}

const initialState = {
  choreoId: null,
  pictures: [] as Picture[],
  isLoading: false,
  error: null,
  isSaving: false,
  isDirty: false,
  saveError: null,
  revision: 0,
};

// Applies a local edit and flags the store as having unsaved changes.
const edited = (state: PicturesState, pictures: Picture[]) => ({
  pictures,
  isDirty: true,
});

// Sets x and/or y of one dancer in one picture, adding the dancer if needed.
const upsertCoordinate = (
  pictures: Picture[],
  id: string,
  coupleNumber: number,
  role: Role,
  patch: Partial<Pick<DancerPosition, "x" | "y">>,
): Picture[] =>
  pictures.map((p) => {
    if (p.id !== id) return p;
    const matches = (c: DancerPosition) =>
      c.coupleNumber === coupleNumber && c.role === role;
    const coordinates = p.coordinates.some(matches)
      ? p.coordinates.map((c) => (matches(c) ? { ...c, ...patch } : c))
      : [...p.coordinates, { coupleNumber, role, x: 0, y: 0, ...patch }];
    return { ...p, coordinates };
  });

const usePictures = create<PicturesState>()((set, get) => ({
  ...initialState,
  setChoreoId: (id) => set({ choreoId: id }),
  resetPictures: () => set({ ...initialState }),

  // Loading (called by loadChoreo, never fetches on its own)
  beginLoad: (id) => set({ ...initialState, choreoId: id, isLoading: true }),
  failLoad: (message) => set({ error: message, isLoading: false }),
  hydrate: (choreo) =>
    set({
      pictures: Array.isArray(choreo?.pictures) ? choreo.pictures : [],
      isLoading: false,
      error: null,
      isDirty: false,
      saveError: null,
    }),

  // Local edits (never touch the backend)
  addPicture: (coordinates) => {
    const id = Math.random().toString(36).slice(2, 9);
    set((state) => {
      const order = Math.max(0, ...state.pictures.map((p) => p.order)) + 1;
      const newPic: Picture = {
        id,
        coordinates: coordinates || [],
        order,
        title: "Picture",
        comment: "",
      };
      return edited(state, [...state.pictures, newPic]);
    });
    return id;
  },

  reorderPicture: (id, previd, nextid) => {
    const { pictures } = get();
    const prevPic = pictures.find((p) => p.id === previd);
    const nextPic = pictures.find((p) => p.id === nextid);
    if (!prevPic || !nextPic) {
      throw new Error("Picture not found");
    }
    const newOrder = (prevPic.order + nextPic.order) / 2;
    set((state) =>
      edited(
        state,
        state.pictures.map((p) =>
          p.id === id ? { ...p, order: newOrder } : p,
        ),
      ),
    );
  },

  updateComment: (id, comment) =>
    set((state) =>
      edited(
        state,
        state.pictures.map((p) => (p.id === id ? { ...p, comment } : p)),
      ),
    ),

  updateTitle: (id, title) =>
    set((state) =>
      edited(
        state,
        state.pictures.map((p) => (p.id === id ? { ...p, title } : p)),
      ),
    ),

  updateCoordinate: (id, coordinate) =>
    set((state) =>
      edited(
        state,
        upsertCoordinate(
          state.pictures,
          id,
          coordinate.coupleNumber,
          coordinate.role,
          { x: coordinate.x, y: coordinate.y },
        ),
      ),
    ),

  updateX: (id, coupleNumber, role, x) =>
    set((state) =>
      edited(
        state,
        upsertCoordinate(state.pictures, id, coupleNumber, role, { x }),
      ),
    ),

  updateY: (id, coupleNumber, role, y) =>
    set((state) =>
      edited(
        state,
        upsertCoordinate(state.pictures, id, coupleNumber, role, { y }),
      ),
    ),

  deletePicture: (id) =>
    set((state) =>
      edited(
        state,
        state.pictures.filter((p) => p.id !== id),
      ),
    ),

  renumberCouple: (from: number, to: number) => {
    if (from === to) return;
    set((state) =>
      edited(
        state,
        state.pictures.map((p) => ({
          ...p,
          coordinates: p.coordinates
            // drop stale positions already stored under the target number
            .filter((c) => c.coupleNumber !== to)
            .map((c) =>
              c.coupleNumber === from ? { ...c, coupleNumber: to } : c,
            ),
        })),
      ),
    );
  },

  removeCouple: (number: any) =>
    set((state) =>
      edited(
        state,
        state.pictures.map((p) => ({
          ...p,
          coordinates: p.coordinates.filter((c) => c.coupleNumber !== number),
        })),
      ),
    ),

  // Saving. On failure the local state is kept, isDirty stays true and saveError is set.
  savePictures: async () => {
    const { choreoId, pictures } = get();
    if (!choreoId) {
      set({ saveError: "Save the choreography settings first." });
      return false;
    }
    set({ isSaving: true, saveError: null });
    try {
      await updatePictures(choreoId, { pictures });
      set((state) => ({
        isSaving: false,
        isDirty: false,
      }));
      return true;
    } catch (err: any) {
      console.error("Failed to save pictures:", err);
      set({
        isSaving: false,
        saveError:
          err?.response?.data?.message ||
          (err instanceof Error ? err.message : "Failed to save pictures"),
      });
      return false;
    }
  },
}));

export default usePictures;
