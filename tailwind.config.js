module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          black: '#121212',
          white: '#FFFFFF',
          gray: '#282828',
          lightgray: '#B3B3B3',
          darkgray: '#181818',
          hover: '#282828',
          accent: '#1ED760'
        }
      },
      backgroundImage: {
        'gradient-spotify': 'linear-gradient(180deg, rgba(24,24,24,1) 0%, rgba(18,18,18,1) 100%)'
      }
    }
  },
  plugins: [],
} 