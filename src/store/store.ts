import { AnyAction, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { useDispatch } from 'react-redux';

import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { combineReducers } from 'redux';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, PersistConfig } from 'redux-persist';
import authSliceReducer from '../auth/auth.reducer';
import joinCommunitySliceReducer from '../pages/community/join/store/join.reducer';

const persistConfig: PersistConfig<any> = {
  key: 'appState',
  storage,
  stateReconciler: autoMergeLevel2,
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
