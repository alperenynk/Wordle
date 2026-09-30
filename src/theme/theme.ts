import type { Settings } from "../types";

export interface Palette {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accent2: string;
  correct: string;
  correctText: string;
  present: string;
  presentText: string;
  absent: string;
  absentText: string;
  danger: string;
  overlay: string;
  toastBg: string;
  toastText: string;
}

const dark: Palette = {
  bg: "#0e1016",
  surface: "#171923",
  surfaceAlt: "#1f2230",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.18)",
  text: "#eef0f5",
  textMuted: "#8b90a3",
  textFaint: "#565b6e",
  accent: "#7c8cff",
  accent2: "#a78bfa",
  correct: "#22c55e",
  correctText: "#06210f",
  present: "#f59e0b",
  presentText: "#2b1a02",
  absent: "#3a3d4c",
  absentText: "#7c8196",
  danger: "#f87171",
  overlay: "rgba(0,0,0,0.6)",
  toastBg: "#eef0f5",
  toastText: "#0e1016",
};

const light: Palette = {
  bg: "#f4f5fb",
  surface: "#ffffff",
  surfaceAlt: "#eceefa",
  border: "rgba(20,20,40,0.08)",
  borderStrong: "rgba(20,20,40,0.2)",
  text: "#191b26",
  textMuted: "#62667a",
  textFaint: "#a2a6bb",
  accent: "#6672f5",
  accent2: "#8b6cf0",
  correct: "#22c55e",
  correctText: "#06210f",
  present: "#f59e0b",
  presentText: "#2b1a02",
  absent: "#d3d6e2",
  absentText: "#8a8fa5",
  danger: "#dc2626",
  overlay: "rgba(20,20,40,0.45)",
  toastBg: "#191b26",
  toastText: "#f4f5fb",
};

export function getPalette(theme: Settings["theme"]): Palette {
  return theme === "dark" ? dark : light;
}
