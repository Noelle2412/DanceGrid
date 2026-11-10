import { create } from "zustand";
import { getChoreo, createChoreo, updateChoreo } from "@/api/choreos";

const defaultSettings = {
  name: "",
  gridSize: [16, 16],
  soloMode: false,
};

const useChoreoSettings = create((set, get) => ({
  choreoId: null,
  settings: defaultSettings,
  isLoading: false,
  isSaving: false,
  error: null,

  setChoreoId: (id) => set({ choreoId: id }),

  resetSettings: () =>
    set({
      choreoId: null,
      settings: defaultSettings,
      error: null,
      isLoading: false,
    }),

  updateSettings: (newSettings) => set({ settings: newSettings }),

  fetchChoreoSettings: async (id) => {
    if (!id) return;
    set({ choreoId: id, isLoading: true, error: null });
    try {
      const choreo = await getChoreo(id);
      if (choreo) {
        set({
          settings: {
            name: choreo.name || "",
            gridSize: [Number(choreo.gridSize[0]), Number(choreo.gridSize[1])],
            soloMode: choreo.mode === "solo",
          },
          isLoading: false,
        });
        return settings;
      }
    } catch (err) {
      console.error("Failed to load choreo settings:", err);
      set({ error: err?.message || "Failed to load", isLoading: false });
    }
  },

  saveChoreoSettings: async ({ userId }) => {
    const { choreoId, settings } = get();
    if (!userId && !choreoId) {
      throw new Error("Please log in to save a new choreography.");
    }

    set({ isSaving: true, error: null });

    const body = {
      name: settings.name || "Untitled Choreography",
      owner: userId,
      gridSize: settings.gridSize,
      mode: settings.soloMode ? "solo" : "couple",
    };

    try {
      if (choreoId) {
        await updateChoreo(choreoId, body);
        set({ isSaving: false });
        return { id: choreoId, updated: true };
      } else {
        const response = await createChoreo(body);
        const newId = response?._id;
        set({ choreoId: newId, isSaving: false });
        return { id: newId, created: true };
      }
    } catch (err) {
      set({ isSaving: false });
      console.error("Failed to save choreography:", err);
      throw err;
    }
  },

  updateName: (newName) =>
    set((state) => ({
      settings: { ...state.settings, name: newName },
    })),

  updateX: (x) =>
    set((state) => ({
      settings: {
        ...state.settings,
        gridSize: [Number(x), state.settings.gridSize[1]],
      },
    })),

  updateY: (y) =>
    set((state) => ({
      settings: {
        ...state.settings,
        gridSize: [state.settings.gridSize[0], Number(y)],
      },
    })),

  updateMode: (soloMode) =>
    set((state) => ({
      settings: { ...state.settings, soloMode: Boolean(soloMode) },
    })),
}));

export default useChoreoSettings;
