import { createContext, useContext } from "react";
import type { Palette } from "./theme";
import { getPalette } from "./theme";

export const ThemeContext = createContext<Palette>(getPalette("dark"));

export function useTheme(): Palette {
  return useContext(ThemeContext);
}
