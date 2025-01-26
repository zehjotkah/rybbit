import { useTheme } from "next-themes";

export function useNivoTheme() {
  const { theme } = useTheme();
  const chartTheme = {
    axis: {
      ticks: {
        text: {
          fill: theme === "dark" ? "#ffffff" : "#000000",
        },
      },
      legend: {
        text: {
          fill: theme === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
    grid: {
      line: {
        stroke: theme === "dark" ? "#737373" : "#d4d4d4",
        strokeWidth: 1,
      },
    },
    legends: {
      text: {
        fill: theme === "dark" ? "#ffffff" : "#000000",
      },
    },
    tooltip: {
      container: {
        background: theme === "dark" ? "hsl(var(--background))" : "white",
        color: theme === "dark" ? "#ffffff" : "#000000",
        fontSize: 12,
      },
    },
  };
  return chartTheme;
}
