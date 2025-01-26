import { create } from "zustand";

type Store = {
  date: string;
  setDate: (date: string) => void;
};

export const useStore = create<Store>((set) => ({
  date: "1d",
  setDate: (date) => set({ date }),
}));
