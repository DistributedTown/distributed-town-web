import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { CssBaseline } from '@mui/material';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/store';
import { SwTheme } from './theme';
import './index.css';

const persistor = persistStore(store);

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={SwTheme}>
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
