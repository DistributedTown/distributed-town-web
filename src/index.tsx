import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {
  createTheme,
  StyledEngineProvider,
  ThemeOptions,
  ThemeProvider,
} from "@mui/material/styles";
import { BrowserRouter as Router } from "react-router-dom";
const theme = createTheme({
  palette: {
    type: "dark",
    text: {
      primary: "#fff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    primary: {
      main: "#161615",
    },
    secondary: {
      main: "#D8D8D8",
    },
    background: {
      default: "#161615",
      paper: "#D8D8D8",
    },
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: ["Josefin Sans", " sans-serif"].join(','),
  },
} as ThemeOptions);

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <Router basename="/distributed-town-web">
        <App />
      </Router>
    </ThemeProvider>
  </StyledEngineProvider>,
  document.getElementById("root")
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
