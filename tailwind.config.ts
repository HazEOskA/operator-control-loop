import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        alfred: {
          idle: "#6366f1",
          thinking: "#f59e0b",
          working: "#10b981",
          waiting: "#3b82f6",
          error: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};

export default config;
