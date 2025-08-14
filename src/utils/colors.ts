// Color constants in hex format
export const colors = {
  // Primary colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Gray colors
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  // Green colors
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Red colors
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Common colors
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",

  // Shadow colors (converted from RGBA)
  shadow: {
    light: "#0000001a",
    medium: "#00000033",
    dark: "#00000080",
  },

  // Focus ring colors
  focus: {
    blue: "#3b82f64d",
    ring: "#3b82f680",
  },

  // Overlay colors
  overlay: {
    light: "#80808033",
    medium: "#8080804d",
    dark: "#80808080",
  },
};

// Theme-specific color mappings
export const themeColors = {
  light: {
    background: colors.white,
    surface: colors.gray[50],
    border: colors.gray[300],
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
      muted: colors.gray[500],
    },
    button: {
      primary: colors.primary[500],
      primaryHover: colors.primary[600],
      secondary: colors.gray[100],
      secondaryHover: colors.gray[200],
    },
  },
  dark: {
    background: colors.gray[900],
    surface: colors.gray[800],
    border: colors.gray[700],
    text: {
      primary: colors.gray[100],
      secondary: colors.gray[400],
      muted: colors.gray[500],
    },
    button: {
      primary: colors.primary[500],
      primaryHover: colors.primary[600],
      secondary: colors.gray[700],
      secondaryHover: colors.gray[600],
    },
  },
};

// CSS Custom Property names for use in styled components
export const cssVars = {
  // Primary colors
  primary: {
    50: "var(--color-primary-50)",
    100: "var(--color-primary-100)",
    200: "var(--color-primary-200)",
    300: "var(--color-primary-300)",
    400: "var(--color-primary-400)",
    500: "var(--color-primary-500)",
    600: "var(--color-primary-600)",
    700: "var(--color-primary-700)",
    800: "var(--color-primary-800)",
    900: "var(--color-primary-900)",
  },

  // Gray colors
  gray: {
    50: "var(--color-gray-50)",
    100: "var(--color-gray-100)",
    200: "var(--color-gray-200)",
    300: "var(--color-gray-300)",
    400: "var(--color-gray-400)",
    500: "var(--color-gray-500)",
    600: "var(--color-gray-600)",
    700: "var(--color-gray-700)",
    800: "var(--color-gray-800)",
    900: "var(--color-gray-900)",
  },

  // Common colors
  white: "var(--color-white)",
  black: "var(--color-black)",
  transparent: "var(--color-transparent)",

  // Shadow colors
  shadow: {
    light: "var(--color-shadow-light)",
    medium: "var(--color-shadow-medium)",
    dark: "var(--color-shadow-dark)",
  },

  // Focus colors
  focus: {
    blue: "var(--color-focus-blue)",
    ring: "var(--color-focus-ring)",
  },

  // Overlay colors
  overlay: {
    light: "var(--color-overlay-light)",
    medium: "var(--color-overlay-medium)",
    dark: "var(--color-overlay-dark)",
  },
};
