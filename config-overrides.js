const path = require("path");
const {
  override,
  addWebpackAlias,
  addPostcssPlugins,
} = require("customize-cra");
module.exports = override(
  addWebpackAlias({
    "react": path.resolve("./node_modules/react"),
    "react-dom": path.resolve("./node_modules/react-dom"),
    "@mui/material": path.resolve("./node_modules/@mui/material"),
    "@emotion/react": path.resolve("./node_modules/@emotion/react"),
    "@emotion/styled": path.resolve("./node_modules/@emotion/styled"),
    "react-router-dom": path.resolve("./node_modules/react-router-dom"),
  }),
  addPostcssPlugins([require("tailwindcss"), require("autoprefixer")])
);
