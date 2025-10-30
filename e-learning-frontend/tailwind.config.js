/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // dùng cho Expo Router
    "./src/**/*.{js,jsx,ts,tsx}", // (thư mục src)
    "./components/**/*.{js,jsx,ts,tsx}", // (thư mục components riêng)
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
