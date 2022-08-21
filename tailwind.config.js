/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './Components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'navbar': '#3d3c42',
      'body': '#a6d1e6',
      "light-button-gray": "#bfbfbf",
    },
    fontFamily: {
      cursive: ['Cedarville Cursive', 'cursive'],
      pixel: ['Silkscreen', 'cursive'],
      about: ['Montserrat', 'sans-serif'],
    },
    borderRadius: {
      card: "10px",
      button: "50px",
      image: "100px"
    },
    boxShadow: {
      "light-card":
        "12px 12px 16px 0 rgba(255, 255, 255, 0.25), -8px -8px 12px 0 rgba(0, 0, 0, .25)",
      "light-button":
        "6px 6px 8px 0 rgba(255, 255, 255, 0.25), -4px -4px 6px 0 rgba(0, 0, 0, .25)"
    },

    height: {
      fullscreen: "150vh",
      navButton: "5vh",
      card: "30vh",
    },
    width: {
      navButton: "5vh",
      card: "70vh",
      button: "20vh",
    },
    
    
  },
  plugins: [],
}
