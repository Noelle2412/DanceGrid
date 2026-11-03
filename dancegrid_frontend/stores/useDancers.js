import { create } from "zustand";
const useDancers = create((set) => ({
  couples: [],

  updateCouple: (number, newNumber) => {
    set((state) => {
      if (state.couples.find((c) => c.number == newNumber)) {
        throw new Error(`Couple / dancer number ${newNumber} already exists.`);
      }
      const couples = state.couples.map((c) => {
        if (c.number == number) {
          c.number = newNumber;
        }
        return c;
      });
      return couples;
    });
  },

  updateDancer: (number, role, name, color, shape) => {
    set((state) => {
      const couples = state.couples.map((c) => {
        if (c.number === number) {
          if (role === "leader") {
            c.leader.name = name;
            c.leader.shape = shape;
            c.leader.color = color;
          } else {
            c.follower.name = name;
            c.follower.shape = shape;
            c.follower.color = color;
          }
        }
      });
      return couples;
    });
  },
  addCouple: (number, leader, follower) => {
    set((state) => {
      state.couples.push({
        number: number,
        leader: leader,
        follower: follower,
      });
      return state.couples;
    });
  },
  deleteCouple: (number) => {
    set((state) => {
      let couple = state.couples.find((c) => c.number == number);
      state.couples.pop(couple);
      return state.couples;
    });
  },
  generateNumber: (couples) => {
    for (let i = 0; i < couples.length; i++) {
      if (!couples.find((c) => c.number == i)) {
        return i;
      }
    }
    return couples.length;
  },
  validateNumbers: (couples) => {
    let numbers = couples.map((c) => c.number);
    let uniqueNumbers = new Set(numbers);
    return numbers.length === uniqueNumbers.size;
  },
}));

export default useDancers;
