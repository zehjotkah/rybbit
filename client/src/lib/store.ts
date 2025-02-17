import { DateTime } from "luxon";
import { create } from "zustand";

type DateMode = {
  mode: "day";
  day: string;
};

type DateRangeMode = {
  mode: "range";
  startDate: string;
  endDate: string;
};

type WeekMode = {
  mode: "week";
  week: string;
};

type MonthMode = {
  mode: "month";
  month: string;
};

type YearMode = {
  mode: "year";
  year: string;
};

export type Time = DateMode | DateRangeMode | WeekMode | MonthMode | YearMode;

export type TimeBucket = "hour" | "day" | "week" | "month";

type Store = {
  site: string;
  setSite: (site: string) => void;
  time: Time;
  previousTime: Time;
  setTime: (time: Time) => void;
  bucket: TimeBucket;
  setBucket: (bucket: TimeBucket) => void;
};

export const useStore = create<Store>((set) => ({
  site: "",
  setSite: (site) => set({ site }),
  time: {
    mode: "day",
    day: DateTime.now().toISODate(),
  },
  previousTime: {
    mode: "day",
    day: DateTime.now().minus({ days: 1 }).toISODate(),
  },
  setTime: (time) => {
    let bucketToUse: TimeBucket = "hour";
    let previousTime: Time;

    if (time.mode === "day") {
      bucketToUse = "hour";
      previousTime = {
        mode: "day",
        day: DateTime.fromISO(time.day).minus({ days: 1 }).toISODate() ?? "",
      };
    } else if (time.mode === "range") {
      const timeRangeLength =
        DateTime.fromISO(time.endDate).diff(
          DateTime.fromISO(time.startDate),
          "days"
        ).days + 1;

      if (timeRangeLength > 180) {
        bucketToUse = "month";
      } else if (timeRangeLength > 31) {
        bucketToUse = "week";
      }
      bucketToUse = "day";

      previousTime = {
        mode: "range",
        startDate:
          DateTime.fromISO(time.startDate)
            .minus({ days: timeRangeLength })
            .toISODate() ?? "",
        endDate:
          DateTime.fromISO(time.startDate).minus({ days: 1 }).toISODate() ?? "",
      };
    } else if (time.mode === "month") {
      bucketToUse = "day";
      previousTime = {
        mode: "month",
        month:
          DateTime.fromISO(time.month).minus({ months: 1 }).toISODate() ?? "",
      };
    } else if (time.mode === "year") {
      bucketToUse = "month";
      previousTime = {
        mode: "year",
        year: DateTime.fromISO(time.year).minus({ years: 1 }).toISODate() ?? "",
      };
    } else {
      previousTime = time; // fallback case
    }

    set({ time, previousTime, bucket: bucketToUse });
  },
  bucket: "hour",
  setBucket: (bucket) => set({ bucket }),
}));

export const goBack = () => {
  const { time, setTime } = useStore.getState();

  if (time.mode === "day") {
    setTime({
      mode: "day",
      day: DateTime.fromISO(time.day).minus({ days: 1 }).toISODate() ?? "",
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
  const { time, setTime } = useStore.getState();

  if (time.mode === "day") {
    setTime({
      mode: "day",
      day: DateTime.fromISO(time.day).plus({ days: 1 }).toISODate() ?? "",
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
