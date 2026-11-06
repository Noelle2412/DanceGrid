import { create } from "zustand";
import { Dancer, DancerPosition, Picture, Role } from "../components/types";

interface PicturesState {
  pictures: Picture[];
  addPicture: (coordinates: DancerPosition[]) => void;
  updateCoordinate: (id: string, coordinate: DancerPosition) => void;
  updateX: (id: string, coupleNumber: number, role: Role, x: number) => void;
  updateY: (id: string, coupleNumber: number, role: Role, y: number) => void;
  updateComment: (id: string, comment: string) => void;
  updateTitle: (id: string, title: string) => void;
  reorderPicture: (id: string, previd: string, nextid: string) => void;
  deletePicture: (id: string) => void;
}

const usePictures = create<PicturesState>()((set) => ({
  pictures: [],

  addPicture: (coordinates: DancerPosition[]) => {
    set((state: PicturesState) => {
      const orderNumber =
        Math.max(
          0,
          state.pictures
            .map((p: Picture) => p.order)
            .reduce((a: number, b: number) => Math.max(a, b), 0),
        ) + 1;
      const id = Math.random().toString(36).slice(2, 9); // Generate a random ID
      const picture: Picture = {
        coordinates: coordinates || [],
        order: orderNumber,
        id,
        title: "",
      };
      return { pictures: [...state.pictures, picture] };
    });
  },

  reorderPicture: (id: string, previd: string, nextid: string) => {
    set((state: PicturesState) => {
      const prevPic = state.pictures.find((p) => p.id === previd);
      const nextPic = state.pictures.find((p) => p.id === nextid);
      if (!prevPic || !nextPic) {
        throw new Error("Picture not found");
      }
      const newOrder = (prevPic.order + nextPic.order) / 2;
      return {
        pictures: state.pictures.map((p) => {
          if (p.id === id) {
            return { ...p, order: newOrder };
          }
          return p;
        }),
      };
    });
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

  deletePicture: (id: string) => {
    set((state: PicturesState) => ({
      pictures: state.pictures.filter((p: Picture) => p.id !== id),
    }));
  },
}));

export default usePictures;
