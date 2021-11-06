import { ResultState } from '@dito-store/status';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorParser } from '@dito-utils/error-parser';
import { getCommunityInfo } from '@dito-api/skillwallet.api';
import { CommunityCategory } from '../join/store/model';
import { getGigs } from './community.api';
import { Gig } from './model';

export interface CommunityState {
  community: CommunityCategory;
  gigs: Gig[];
  status: ResultState;
}

export const fetchCommunity = createAsyncThunk('community', async (address: string, { dispatch }) => {
  try {
    return await getCommunityInfo(address);
  } catch (error) {
    return ErrorParser(error, dispatch);
  }
});

export const fetchGigs = createAsyncThunk('community/gigs', async (address: string, { dispatch }) => {
  try {
    return await getGigs(address);
  } catch (error) {
    return ErrorParser(error, dispatch);
  }
});

const initialState: CommunityState = {
  community: null,
  status: ResultState.Idle,
  gigs: [],
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
      })
      .addCase(fetchGigs.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        // @ts-ignore
        state.gigs = [...action.payload, ...action.payload, ...action.payload] as any;
        state.status = ResultState.Idle;
      })
      .addCase(fetchGigs.rejected, (state) => {
        state.status = ResultState.Failed;
      });
  },
});

export const { setCommunity } = communitySlice.actions;

export default communitySlice.reducer;
