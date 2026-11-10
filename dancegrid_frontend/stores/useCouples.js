import { create } from "zustand";
import { getChoreo, updateCouples } from "@/api/choreos";

const useCouples = create((set, get) => ({
  choreoId: null,
  couples: [],
  isLoading: false,
  error: null,

  setChoreoId: (id) => set({ choreoId: id }),

  setCouples: (couples) => set({ couples: couples || [] }),

  resetCouples: () =>
    set({ choreoId: null, couples: [], error: null, isLoading: false }),

  // Centralized backend sync helper
  syncWithBackend: async (couplesOverride) => {
    const { choreoId } = get();
    if (!choreoId) return;
    const toSend = couplesOverride ?? get().couples;
    try {
      await updateCouples(choreoId, { couples: toSend });
    } catch (err) {
      console.error("Failed to sync couples with backend:", err);
      throw err;
    }
  },

  fetchCouples: async (choreoId) => {
    if (!choreoId) return;
    set({ choreoId, isLoading: true, error: null });
    try {
      const choreo = await getChoreo(choreoId);
      const couplesData =
        choreo?.couples ||
        choreo?.dancers ||
        choreo?.choreo?.couples ||
        choreo?.choreo?.dancers ||
        [];

      const normalized = (couplesData || []).map((c) => ({
        ...c,
        leader: {
          name: c.leader?.name ?? "Name",
          color: c.leader?.color ?? "#000000",
          shape: c.leader?.shape ?? "circle",
        },
        follower: {
          name: c.follower?.name ?? "Name",
          color: c.follower?.color ?? "#000000",
          shape: c.follower?.shape ?? "circle",
        },
      }));

      set({ couples: normalized, isLoading: false });
      return normalized;
    } catch (err) {
      console.error("Failed to fetch dancers:", err);
      set({
        error: err?.message || "Failed to load dancers",
        isLoading: false,
      });
    }
  },

  updateCouple: async (number, newNumber) => {
    if (number === newNumber) return;
    const { couples } = get();
    if (couples.some((c) => c.number === newNumber)) {
      throw new Error(`Couple / dancer number ${newNumber} already exists.`);
    }

    const nextCouples = couples.map((c) =>
      c.number === number ? { ...c, number: newNumber } : c,
    );
    set({ couples: nextCouples });
    await get().syncWithBackend(nextCouples);
  },

  updateDancer: (number, role, name, color, shape) => {
    set((state) => ({
      couples: state.couples.map((c) => {
        if (c.number === number) {
          const dancer = c[role] || {};
          return {
            ...c,
            [role]: {
              ...dancer,
              name:
                name !== undefined && name !== null
                  ? name
                  : (dancer.name ?? "Name"),
              color:
                color !== undefined && color !== null
                  ? color
                  : (dancer.color ?? "#000000"),
              shape:
                shape !== undefined && shape !== null
                  ? shape
                  : (dancer.shape ?? "circle"),
            },
          };
        }
        return c;
      }),
    }));
  },

  addCouple: async (number, leader, follower) => {
    const nextCouples = [
      ...get().couples,
      {
        number,
        leader: leader || {
          name: "Name",
          color: "#000000",
          shape: "circle",
        },
        follower: follower || {
          name: "Name",
          color: "#000000",
          shape: "circle",
        },
      },
    ];
    set({ couples: nextCouples });
    await get().syncWithBackend(nextCouples);
  },

  deleteCouple: async (number) => {
    const nextCouples = get().couples.filter((c) => c.number !== number);
    set({ couples: nextCouples });
    await get().syncWithBackend(nextCouples);
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
}));

export default useCouples;
