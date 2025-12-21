// theme.ts (exemplo)
export const theme = {
  tokens: {
    colors: {
      brand: {
        500: { value: "#0B5BFF" },
        600: { value: "#0948CC" },
      },
    },
    radii: {
      card: { value: "18px" },
    },
    shadows: {
      card: { value: "0 10px 24px rgba(20,60,120,0.10)" },
    },
  },
  semanticTokens: {
    colors: {
      "app.bg": {
        value: { base: "#F3F8FF", _dark: "#0B1220" },
      },
      "card.bg": {
        value: { base: "white", _dark: "#111827" },
      },
      "text.muted": {
        value: { base: "#5C6B82", _dark: "#94A3B8" },
      },
    },
  },
};
