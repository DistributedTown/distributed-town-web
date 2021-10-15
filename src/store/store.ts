import { AnyAction, configureStore, Dispatch, ThunkDispatch } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { useDispatch } from 'react-redux';
import joinCommunitySliceReducer from '../pages/community/join/store/join.reducer';
import authSliceReducer from '../auth/auth.reducer';

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  reducer: {
    joinCommunity: joinCommunitySliceReducer,
    auth: authSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
