import { create } from "zustand";

const useChoreoSettings = create((set) => ({
  settings: { name: "", gridSize: [16, 16], soloMode: false },

  updateSettings: (newSettings) => set({ settings: newSettings }),
  updateName: (newName) =>
    set((state) => {
      state.settings.name = newName;
      return state.settings;
    }),
  updateX: (x) =>
    set((state) => {
      state.settings.gridSize[0] = x;
      return state.settings;
    }),
  updateY: (y) =>
    set((state) => {
      state.settings.gridSize[1] = y;
      return state.settings;
    }),
  updateMode: (soloMode) =>
    set((state) => {
      state.settings.soloMode = soloMode;
      return state.settings;
    }),
}));

export default useChoreoSettings;
