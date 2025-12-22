import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  responsiveFontSizes,
} from "@mui/material";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      // Airbnb brand-like red
      main: "#FF385C",
    },
    secondary: {
      main: "#FF5A5F",
    },
    background: {
      default: "#ffffff",
    },
  },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#FF385C",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorDefault: {
          backgroundColor: "#ffffff",
          color: "#222222",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
