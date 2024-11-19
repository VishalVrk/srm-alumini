// Add the following to your 'tailwind.config.js'
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
module.exports = {
  theme: {
    extend: {
      maxHeight: {
        'chat': 'calc(100vh - 150px)',
      },
    },
  },
  plugins: [],
};
