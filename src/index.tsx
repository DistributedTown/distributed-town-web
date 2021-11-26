import './index.css';
import { createTheme, StyledEngineProvider, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { CssBaseline } from '@mui/material';
import createShadows from '@dito-utils/shadows';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/store';

const persistor = persistStore(store);

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        .Mui-disabled {
          color: #CCCCCC;
        }
      `,
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          border: '3px solid',
          borderColor: 'text.primary',
          borderRadius: '4px',
          backgroundColor: 'black',
          padding: '16px',
        },
      },
    },
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: 'text.primary',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    type: 'dark',
    text: {
      secondary: '#D8D8D8',
      primary: '#FFFFFF',
    },
    primary: {
      main: '#161615',
    },
    secondary: {
      main: '#8F37AA',
    },
    info: {
      main: '#FFFFFF',
      dark: '#7C7C7C',
    },
  },
  shape: {
    borderRadius: 0,
  },
  shadows: createShadows('#8F37AA') as any,
  typography: {
    fontSize: 16,
    button: {
      fontSize: '1.25rem', // 20px
    },
    body1: {
      fontSize: '0.875rem', // 14px
    },
    body2: {
      fontSize: '0.75rem', // 12px
    },
    subtitle1: {
      fontSize: '1rem', // 16px
    },
    subtitle2: {
      fontSize: '0.875rem', // 14px
    },
    h1: {
      fontSize: '1.875rem', // 30px
    },
    h2: {
      fontSize: '1.25rem', // 20px
    },
    h3: {
      fontSize: '1.125rem', // 18px
    },
    h4: {
      fontSize: '0.875rem', // 14px
    },
    h5: {
      fontSize: '0.75rem', // 12px
    },
    h6: {
      fontSize: '0.625rem', // 10px
    },
    fontFamily: ['Josefin Sans', ' sans-serif'].join(','),
  },
} as ThemeOptions);

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <HashRouter basename="/">
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <CssBaseline />
            <App />
          </PersistGate>
        </Provider>
      </HashRouter>
    </ThemeProvider>
  </StyledEngineProvider>,
  document.getElementById('root')
);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
