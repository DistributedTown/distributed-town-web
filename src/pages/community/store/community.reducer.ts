import { ResultState } from '@dito-store/status';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorParser } from '@dito-utils/error-parser';
import { getCommunityInfo } from '@dito-api/skillwallet.api';
import { CommunityCategory } from '../join/store/model';

export interface CommunityState {
  community: CommunityCategory;
  status: ResultState;
}

export const fetchCommunity = createAsyncThunk('community', async (address: string, { dispatch }) => {
  try {
    return await getCommunityInfo(address);
  } catch (error) {
    return ErrorParser(error, dispatch);
  }
});

const initialState: CommunityState = {
  community: null,
  status: ResultState.Idle,
};

export const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setCommunity(state, action) {
      state.community = action.payload;
    },
    resetCommunityState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunity.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(fetchCommunity.fulfilled, (state, action) => {
        state.community = action.payload as any;
        state.status = ResultState.Idle;
      })
      .addCase(fetchCommunity.rejected, (state) => {
        state.status = ResultState.Failed;
      });
  },
});

export const { setCommunity } = communitySlice.actions;

export default communitySlice.reducer;
