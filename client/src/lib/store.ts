import { DateTime } from "luxon";
import { create } from "zustand";

export type DateMode = "day" | "week" | "month" | "year" | "custom";

type Store = {
  date: string[];
  setDate: (date: string[]) => void;

  mode: DateMode;
  setMode: (mode: DateMode) => void;
};

export const useStore = create<Store>((set) => ({
  date: [DateTime.now().toISODate(), DateTime.now().toISODate()],
  setDate: (date) => set({ date }),

  mode: "day",
  setMode: (mode) => set({ mode }),
}));
