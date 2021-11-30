import './index.css';
import { createTheme, StyledEngineProvider, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { CssBaseline, Fade, PaletteOptions, SimplePaletteColorOptions } from '@mui/material';
import createShadows from '@dito-utils/shadows';
import { Shadows } from '@mui/material/styles/shadows';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/store';

const persistor = persistStore(store);

const palette: PaletteOptions & { type: string } = {
  type: 'dark',
  background: {
    default: '#161615',
    paper: '#FFFFFF',
  },
  text: {
    secondary: '#D8D8D8',
    primary: '#FFFFFF',
    disabled: '#CCCCCC',
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
};

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        .Mui-disabled {
          color: ${palette.text.disabled};
        }
      `,
    },
    MuiTooltip: {
      defaultProps: {
        TransitionComponent: Fade,
      },
      styleOverrides: {
        tooltip: {
          border: '3px solid',
          borderColor: palette.text.primary,
          borderRadius: '4px',
          backgroundColor: palette.background.default,
          boxSizing: 'border-box',
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
          borderColor: palette.text.primary,
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
  palette,
  shape: {
    borderRadius: 0,
  },
  shadows: createShadows((palette.secondary as SimplePaletteColorOptions).main) as Shadows,
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

reportWebVitals();
