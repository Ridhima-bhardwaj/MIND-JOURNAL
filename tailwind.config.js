/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // include your React files
  ],
  theme: {
    extend: {
      colors: {
        // 🎭 Mood-based custom colors
        moodHappy: "#FFD93D",   // yellow for happy
        moodSad: "#6A67CE",     // purple for sad
        moodCalm: "#38B6FF",    // blue for calm
        moodAngry: "#FF6B6B",   // red for angry
        moodNeutral: "#A0AEC0", // gray for neutral

        softBg: "#F9FAFB",      // light background
        softCard: "#FFFFFF",    // white card
        softText: "#374151",    // dark gray text
        softAccent: "#3B82F6",  // accent blue
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // clean modern font
        heading: ["Poppins", "sans-serif"], // for headings
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)", // soft card shadow
      },
    },
  },
  plugins: [],
};
