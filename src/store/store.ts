import { configureStore } from "@reduxjs/toolkit";
import joinCommunitySliceReducer from "../pages/community/join/store/join.reducer";

export const store = configureStore({
  reducer: {
    joinCommunity: joinCommunitySliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;