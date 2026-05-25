/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0f1729",
        secondary: "#f44034",
        tertiary: "#0b111e",
        background: "#0b1220",
        foreground: "#F1F5F9",
        card: "#0a0f1c",
        muted: { foreground: "#95A3B8" },
      },
      fontFamily: {
        sans: ["DMSans-Regular"],

        "dm-light": ["DMSans-Light"],
        "dm-regular": ["DMSans-Regular"],
        "dm-medium": ["DMSans-Medium"],
        "dm-semibold": ["DMSans-SemiBold"],
        "dm-bold": ["DMSans-Bold"],
      },
    },
  },
  plugins: [],
};
