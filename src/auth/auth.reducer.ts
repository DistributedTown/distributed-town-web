import { createSlice } from '@reduxjs/toolkit';
import Web3 from 'web3';

export interface AuthState {
  isAutheticated: boolean;
  web3jsInstance: Web3;
  userInfo: any;
  userAddress: string;
}

const initialState: AuthState = {
  isAutheticated: false,
  web3jsInstance: null,
  userAddress: null,
  userInfo: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state, action) {
      const { isAuthenticated, userInfo } = action.payload;
      state.isAutheticated = isAuthenticated;
      state.userInfo = userInfo;
    },
    setWeb3jsInstance(state, action) {
      state.web3jsInstance = action.payload;
    },
    setUserAddress(state, action) {
      state.userAddress = action.payload;
    },
    resetAuthState: () => initialState,
  },
});

export const { setAuthenticated, setWeb3jsInstance, setUserAddress, resetAuthState } = authSlice.actions;

export default authSlice.reducer;
