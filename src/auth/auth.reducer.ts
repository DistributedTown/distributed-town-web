import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  isAutheticated: boolean;
}

const initialState: AuthState = {
  isAutheticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state, action) {
      state.isAutheticated = action.payload;
    },
    resetAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    // implement builder
  },
});

export const { setAuthenticated, resetAuthState } = authSlice.actions;

export default authSlice.reducer;
