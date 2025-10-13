import { DateTime } from "luxon";
import { create } from "zustand";

interface TimelineStore {
  currentTime: DateTime | null;
  timeRange: { start: DateTime; end: DateTime } | null;
  windowSize: number; // in minutes
  manualWindowSize: number | null; // User-selected window size, overrides auto-calculated
  setCurrentTime: (time: DateTime) => void;
  setTimeRange: (start: DateTime, end: DateTime) => void;
  setWindowSize: (size: number) => void;
  setManualWindowSize: (size: number | null) => void;
  reset: () => void;
}

export const useTimelineStore = create<TimelineStore>(set => ({
  currentTime: null,
  timeRange: null,
  windowSize: 60,
  manualWindowSize: null,
  setCurrentTime: time => set({ currentTime: time }),
  setTimeRange: (start, end) => set({ timeRange: { start, end }, currentTime: start }),
  setWindowSize: size => set({ windowSize: size }),
  setManualWindowSize: size => set({ manualWindowSize: size, windowSize: size || 60 }),
  reset: () => set({ currentTime: null, timeRange: null, windowSize: 60, manualWindowSize: null }),
}));
