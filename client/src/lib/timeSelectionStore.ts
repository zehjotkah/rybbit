import { DateTime } from "luxon";
import { create } from "zustand";

type DateMode = {
  mode: "date";
  date: string;
};

type DateRangeMode = {
  mode: "range";
  startDate: string;
  endDate: string;
};

type MonthMode = {
  mode: "month";
  month: string;
};

type YearMode = {
  mode: "year";
  year: string;
};

export type Time = DateMode | DateRangeMode | MonthMode | YearMode;

type Store = {
  time: Time;
  setTime: (time: Time) => void;
};

export const useTimeSelection = create<Store>((set) => ({
  time: {
    mode: "date",
    date: DateTime.now().toISODate(),
  },
  setTime: (time) => set({ time }),
}));

export const goBack = () => {
  const { time, setTime } = useTimeSelection.getState();

  if (time.mode === "date") {
    setTime({
      mode: "date",
      date: DateTime.fromISO(time.date).minus({ days: 1 }).toISODate() ?? "",
    });
  } else if (time.mode === "range") {
    const startDate = DateTime.fromISO(time.startDate);
    const endDate = DateTime.fromISO(time.endDate);

    const daysBetweenStartAndEnd = endDate.diff(startDate, "days").days;

    setTime({
      mode: "range",
      startDate:
        startDate.minus({ days: daysBetweenStartAndEnd }).toISODate() ?? "",
      endDate: startDate.toISODate() ?? "",
    });
  }
};

export const goForward = () => {
  const { time, setTime } = useTimeSelection.getState();

  if (time.mode === "date") {
    setTime({
      mode: "date",
      date:
        DateTime.fromISO(time.date).plus({ days: 1 }).toISODate() ??
        "" > DateTime.now().toISODate()
          ? DateTime.now().toISODate()
          : DateTime.fromISO(time.date).plus({ days: 1 }).toISODate() ?? "",
    });
  } else if (time.mode === "range") {
    const startDate = DateTime.fromISO(time.startDate);
    const endDate = DateTime.fromISO(time.endDate);
    const now = DateTime.now();

    const daysBetweenStartAndEnd = endDate.diff(startDate, "days").days;
    const proposedEndDate = endDate.plus({ days: daysBetweenStartAndEnd });

    // Don't allow moving forward if it would put the entire range in the future
    if (startDate.plus({ days: daysBetweenStartAndEnd }) > now) {
      return;
    }

    setTime({
      mode: "range",
      startDate:
        startDate.plus({ days: daysBetweenStartAndEnd }).toISODate() ?? "",
      // Cap the end date at today
      endDate: proposedEndDate.toISODate() ?? "",
    });
  }
};
