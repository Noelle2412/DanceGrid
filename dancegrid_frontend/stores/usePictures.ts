import { create } from "zustand";
import { DancerPosition, Picture } from "../components/types";

interface PicturesState {
  pictures: Picture[];
  addPicture: (coordinates: DancerPosition[]) => void;
  updatePicture: (id: string, picture: Picture) => void;
  reorderPicture: (id: string, order: number) => void;
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
        coordinates,
        order: orderNumber,
        id,
        title: "",
      };
      return { pictures: [...state.pictures, picture] };
    });
  },

  reorderPicture: () => {},
  updatePicture: () => {},

  deletePicture: (id: string) => {
    set((state: PicturesState) => ({
      pictures: state.pictures.filter((p: Picture) => p.id !== id),
    }));
  },
}));

export default usePictures;
