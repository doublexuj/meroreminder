export const COLORS = [
  { name: "RED", hex: "#FF3B30" },
  { name: "ORANGE", hex: "#FF9500" },
  { name: "YELLOW", hex: "#FFCC00" },
  { name: "GREEN", hex: "#34C759" },
  { name: "CYAN", hex: "#5AC8FA" },
  { name: "BLUE", hex: "#007AFF" },
  { name: "INDIGO", hex: "#5856D6" },
  { name: "PURPLE", hex: "#AF52DE" },
  { name: "PINK", hex: "#FF2D55" },
  { name: "BROWN", hex: "#A2845E" },
  { name: "GRAY", hex: "#8E8E93" },
  { name: "TEAL", hex: "#30B0C7" },
];

export function getColorHex(colorName: string): string {
  return COLORS.find((c) => c.name === colorName)?.hex ?? "#8E8E93";
}
