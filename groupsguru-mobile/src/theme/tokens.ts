/**
 * GroupsGuru Design Tokens — Claude Code Mirror
 * Must stay in sync with globals.css @theme on web.
 */

export const colors = {
  // Backgrounds
  base: "#191919",
  surface: "#1E1E1E",
  elevated: "#2D2D2D",
  overlay: "#363636",
  inset: "#141414",

  // Foregrounds
  fgPrimary: "#E8E8E8",
  fgSecondary: "#A0A0A0",
  fgMuted: "#666666",
  fgFaint: "#3A3A3A",

  // Accent (Anthropic amber)
  accent: "#D97706",
  accentHover: "#F59E0B",
  accentSubtle: "rgba(217,119,6,0.12)",
  accentBorder: "rgba(217,119,6,0.25)",

  // Semantic
  success: "#3D9A5F",
  warning: "#C4901A",
  error: "#C74444",
  info: "#4A8FBF",

  // Borders
  border: "#3A3A3A",
  borderHover: "#666666",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

export const typography = {
  body: {
    fontSize: 15,
    fontWeight: "400" as const,
  },
  bodySm: {
    fontSize: 13,
    fontWeight: "500" as const,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  displayMd: {
    fontSize: 28,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  mono: {
    fontSize: 14,
    fontWeight: "500" as const,
    fontFamily: "monospace",
  },
} as const;
