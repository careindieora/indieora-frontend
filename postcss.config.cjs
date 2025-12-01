module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'clay-1': '#f5efe7',
        'clay-2': '#e6d3c1',
        'clay-3': '#c79b7a',
        'clay-4': '#8b5a3c'
      }
    }
  },
  plugins: []
}
