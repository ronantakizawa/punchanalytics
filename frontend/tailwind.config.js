export const content = [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}"
];
export const theme = {
  extend: {
    keyframes: {
      fade: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      }
    },
    animation: {
      'fade-in': 'fade 1s ease-out'
    }
  },
};
export const plugins = [];