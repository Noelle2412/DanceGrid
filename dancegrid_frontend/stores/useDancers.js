import { create } from "zustand";
const useDancers = create((set) => ({
  couples: [],

  updateDancer: (number, role, color, shape) => {
    set((state) => {
      const couples = state.couples.map((c) => {
        if (c.number === number) {
          if (role === "leader") {
            c.leader.shape = shape;
            c.leader.color = color;
          } else {
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
}));

export default useDancers;
