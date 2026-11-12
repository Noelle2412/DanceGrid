import { create } from "zustand";
import {
  createChoreo,
  updateChoreo,
  getSharedUsers,
  addSharedUser,
  removeSharedUser,
  removeAccess,
} from "@/api/choreos";

const defaultSettings = {
  name: "",
  gridSize: [16, 16],
  soloMode: false,
};

const errorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

const initialState = {
  choreoId: null,
  settings: defaultSettings,
  // Loading (filled by loadChoreo in choreoSession.ts)
  isLoading: false,
  isLoaded: false,
  error: null,
  // Saving
  isSaving: false,
  isDirty: false, // local state differs from the backend
  saveError: null,
  // Sharing
  sharedWith: [],
  isSharing: false,
  shareError: null,
};

const markEdited = (state) => ({
  isDirty: true,
});

const useChoreoSettings = create((set, get) => ({
  ...initialState,
  setChoreoId: (id) => set({ choreoId: id }),
  resetSettings: () => set({ ...initialState }),

  // Loading (called by loadChoreo, never fetches on its own)
  beginLoad: (id) =>
    set({
      ...initialState,
      choreoId: id,
      isLoading: true,
    }),
  failLoad: (message) => set({ error: message, isLoading: false }),
  hydrate: (choreo) => {
    set({
      settings: {
        name: choreo?.name || "",
        gridSize: choreo?.gridSize || [16, 16],
        soloMode: choreo?.mode === "solo",
      },
      isLoading: false,
      isLoaded: true,
      error: null,
      isDirty: false,
      saveError: null,
    });
  },
  // Local edits (never touch the backend)
  updateSettings: (newSettings) =>
    set((state) => ({ settings: newSettings, ...markEdited(state) })),

  updateName: (newName) =>
    set((state) => ({
      settings: { ...state.settings, name: newName },
      ...markEdited(state),
    })),

  updateX: (x) => {
    if (Number(x) <= 0 || typeof Number(x) === NaN) {
      return;
    }
    return set((state) => ({
      settings: {
        ...state.settings,
        gridSize: [Number(x), state.settings.gridSize[1]],
      },
      ...markEdited(state),
    }));
  },

  updateY: (y) => {
    if (Number(x) <= 0 || typeof Number(x) === NaN) {
      return;
    }
    return set((state) => ({
      settings: {
        ...state.settings,
        gridSize: [state.settings.gridSize[0], Number(y)],
      },
      ...markEdited(state),
    }));
  },

  updateMode: (soloMode) =>
    set((state) => ({
      settings: { ...state.settings, soloMode: Boolean(soloMode) },
      ...markEdited(state),
    })),

  // Saving: on success returns true, on failure the local
  // state is kept, isDirty stays true and saveError is set.
  // Creates the choreography if it has no id yet (requires userId), otherwise updates it.
  saveSettings: async ({ userId } = {}) => {
    const { choreoId, settings, revision } = get();

    if (!choreoId && !userId) {
      set({ saveError: "Please log in to save a new choreography." });
      return { ok: false, id: null, created: false };
    }

    set({ isSaving: true, saveError: null });

    const body = {
      name: settings.name || "Untitled Choreography",
      gridSize: settings.gridSize,
      mode: settings.soloMode ? "solo" : "couple",
    };

    try {
      if (choreoId) {
        await updateChoreo(choreoId, body);
        set((state) => ({
          isSaving: false,
          isDirty: false,
        }));
        return { ok: true, id: choreoId, created: false };
      }

      const response = await createChoreo(body);
      const newId = response?._id;
      if (!newId) {
        throw new Error(
          "The server did not return an id for the new choreography.",
        );
      }
      set((state) => ({
        choreoId: newId,
        isLoaded: true,
        isSaving: false,
        isDirty: false,
      }));
      return { ok: true, id: newId, created: true };
    } catch (err) {
      console.error("Failed to save choreography settings:", err);
      set({
        isSaving: false,
        saveError: errorMessage(err, "Failed to save settings"),
      });
      return { ok: false, id: choreoId, created: false };
    }
  },

  // Sharing
  fetchSharedUsers: async (id) => {
    const targetId = id ?? get().choreoId;
    if (!targetId) {
      set({ sharedWith: [] });
      return;
    }
    try {
      const users = await getSharedUsers(targetId);
      set({ sharedWith: Array.isArray(users) ? users : [], shareError: null });
    } catch (err) {
      console.error("Failed to load shared users:", err);
      set({ shareError: errorMessage(err, "Failed to load shared users") });
    }
  },

  shareWith: async (email) => {
    const { choreoId } = get();
    const target = String(email ?? "").trim();
    if (!target) return false;
    if (!choreoId) {
      set({ shareError: "Save the choreography before sharing it." });
      return false;
    }
    set({ isSharing: true, shareError: null });
    try {
      await addSharedUser(choreoId, { email: target });
      set({ isSharing: false });
      await get().fetchSharedUsers(choreoId);
      return true;
    } catch (err) {
      console.error("Failed to share choreography:", err);
      set({
        isSharing: false,
        shareError: errorMessage(err, "Failed to share choreography"),
      });
      return false;
    }
  },

  unshare: async (email) => {
    const { choreoId } = get();
    if (!choreoId) return false;
    set({ isSharing: true, shareError: null });
    try {
      await removeSharedUser(choreoId, { email });
      set({ isSharing: false });
      await get().fetchSharedUsers(choreoId);
      return true;
    } catch (err) {
      console.error("Failed to remove shared user:", err);
      set({
        isSharing: false,
        shareError: errorMessage(err, "Failed to remove user"),
      });
      return false;
    }
  },

  // For a shared user removing themselves.
  // The caller should afterwards call
  // resetChoreo() and navigate away.
  removeOwnAccess: async () => {
    const { choreoId } = get();
    if (!choreoId) return false;
    set({ isSharing: true, shareError: null });
    try {
      await removeAccess(choreoId);
      set({ isSharing: false });
      return true;
    } catch (err) {
      console.error("Failed to remove own access:", err);
      set({
        isSharing: false,
        shareError: errorMessage(err, "Failed to remove access"),
      });
      return false;
    }
  },
}));

export default useChoreoSettings;
