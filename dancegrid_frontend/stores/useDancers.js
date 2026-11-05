import { create } from "zustand";

const useDancers = create((set) => ({
  couples: [],

  updateCouple: (number, newNumber) => {
    set((state) => {
      // If number hasn't changed, do nothing
      if (number === newNumber) {
        return state;
      }
      if (state.couples.some((c) => c.number === newNumber)) {
        throw new Error(`Couple / dancer number ${newNumber} already exists.`);
      }
      return {
        couples: state.couples.map((c) =>
          c.number === number ? { ...c, number: newNumber } : c,
        ),
      };
    });
  },

  updateDancer: (number, role, name, color, shape) => {
    set((state) => ({
      couples: state.couples.map((c) => {
        if (c.number === number) {
          return {
            ...c,
            [role]: {
              ...c[role],
              name: name !== undefined ? name : c[role].name,
              color: color !== undefined ? color : c[role].color,
              shape: shape !== undefined ? shape : c[role].shape,
            },
          };
        }
        return c;
      }),
    }));
  },

  addCouple: (number, leader, follower) => {
    set((state) => ({
      couples: [
        ...state.couples,
        {
          number: number,
          leader: leader,
          follower: follower,
        },
      ],
    }));
  },

  deleteCouple: (number) => {
    set((state) => ({
      couples: state.couples.filter((c) => c.number !== number),
    }));
  },

  generateNumber: (couples) => {
    for (let i = 0; i < couples.length; i++) {
      if (!couples.some((c) => c.number === i)) {
        return i;
      }
    }
    return couples.length;
  },
}));

export default useDancers;
