import { AnyAction, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { useDispatch } from 'react-redux';

import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import authSliceReducer from '../auth/auth.reducer';
import joinCommunitySliceReducer from '../pages/community/join/store/join.reducer';

const persistConfig = {
  key: 'appState',
  storage,
};

const reducers = combineReducers({
  joinCommunity: joinCommunitySliceReducer,
  auth: authSliceReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
