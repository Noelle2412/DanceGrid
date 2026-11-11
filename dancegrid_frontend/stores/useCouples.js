import { create } from "zustand";
import { updateCouples } from "@/api/choreos";

const defaultDancer = () => ({
  name: "Name",
  color: "#000000",
  shape: "circle",
});

const normalizeDancer = (d) => ({
  name: d?.name ?? "Name",
  color: d?.color ?? "#000000",
  shape: d?.shape ?? "circle",
});

const normalizeCouple = (c) => ({
  ...c,
  leader: normalizeDancer(c.leader),
  follower: normalizeDancer(c.follower),
});

const errorMessage = (err, fallback) => err?.message || fallback;

const initialState = {
  choreoId: null,
  couples: [],
  // Loading (filled by loadChoreo in choreoSession.ts)
  isLoading: false,
  error: null,
  // Saving
  isSaving: false,
  isDirty: false, // local state differs from the backend
  saveError: null,
};
// Applies a local edit and flags the store as having unsaved changes.
const edited = (state, couples) => ({
  couples,
  isDirty: true,
});
const useCouples = create((set, get) => ({
  ...initialState,
  setChoreoId: (id) => set({ choreoId: id }),
  setCouples: (couples) => set((state) => edited(state, couples || [])),
  resetCouples: () => set({ ...initialState }),

  // Loading (called by loadChoreo, never fetches on its own)
  beginLoad: (id) => set({ ...initialState, choreoId: id, isLoading: true }),
  failLoad: (message) => set({ error: message, isLoading: false }),
  hydrate: (choreo) => {
    const raw = choreo?.couples || [];
    set({
      couples: raw.map(normalizeCouple),
      isLoading: false,
      error: null,
      isDirty: false,
      saveError: null,
    });
  },

  // Local edits (never touch the backend)
  updateCouple: (number, newNumber) => {
    if (number === newNumber) return;
    if (!Number.isInteger(newNumber)) {
      throw new Error("Couple / dancer number must be a whole number.");
    }
    if (get().couples.some((c) => c.number === newNumber)) {
      throw new Error(`Couple / dancer number ${newNumber} already exists.`);
    }
    set((state) =>
      edited(
        state,
        state.couples.map((c) =>
          c.number === number ? { ...c, number: newNumber } : c,
        ),
      ),
    );
  },

  updateDancer: (number, role, name, color, shape) => {
    set((state) =>
      edited(
        state,
        state.couples.map((c) => {
          if (c.number !== number) return c;
          const dancer = c[role] || {};
          return {
            ...c,
            [role]: {
              ...dancer,
              name: name ?? dancer.name ?? "Name",
              color: color ?? dancer.color ?? "#000000",
              shape: shape ?? dancer.shape ?? "circle",
            },
          };
        }),
      ),
    );
  },

  addCouple: (number, leader, follower) => {
    set((state) =>
      edited(state, [
        ...state.couples,
        {
          number,
          leader: leader || defaultDancer(),
          follower: follower || defaultDancer(),
        },
      ]),
    );
  },

  deleteCouple: (number) => {
    set((state) =>
      edited(
        state,
        state.couples.filter((c) => c.number !== number),
      ),
    );
  },

  generateNumber: (couples) => {
    const list = couples || get().couples;
    for (let i = 0; i < list.length; i++) {
      if (!list.some((c) => c.number === i)) {
        return i;
      }
    }
    return list.length;
  },

  // Saving: on success returns true, on failure the local
  // state is kept, isDirty stays true and saveError is set.
  saveCouples: async () => {
    const { choreoId, couples, revision } = get();
    if (!choreoId) {
      set({ saveError: "Save the choreography settings first." });
      return false;
    }
    set({ isSaving: true, saveError: null });
    try {
      await updateCouples(choreoId, { couples });
      set((state) => ({
        isSaving: false,
        isDirty: false,
      }));
      return true;
    } catch (err) {
      console.error("Failed to save couples:", err);
      set({
        isSaving: false,
        saveError: errorMessage(err, "Failed to save dancers"),
      });
      return false;
    }
  },
}));

export default useCouples;
