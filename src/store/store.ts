import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { combineReducers } from 'redux';
import { persistReducer, PersistConfig } from 'redux-persist';
import authSliceReducer from '../auth/auth.reducer';
import joinCommunitySliceReducer from '../pages/community/join/store/join.reducer';
import uiSliceReducer from './ui-reducer';
import communitySliceReducer from '../pages/community/store/community.reducer';

const persistConfig: PersistConfig<any> = {
  key: 'appState',
  storage,
  stateReconciler: autoMergeLevel2,
  blacklist: ['auth'],
};

const reducers = combineReducers({
  joinCommunity: joinCommunitySliceReducer,
  auth: authSliceReducer,
  ui: uiSliceReducer,
  community: communitySliceReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
  reducer: persistedReducer,
});

export default store;
