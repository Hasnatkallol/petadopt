module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js", // add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin') // add this plugin
  ],
};
