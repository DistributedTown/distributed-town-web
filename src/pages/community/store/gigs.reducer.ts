import { ResultState } from '@dito-store/status';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ErrorParser, ParseSWErrorMessage } from '@dito-utils/error-parser';
import { openSnackbar } from '@dito-store/ui-reducer';
import { takeGig as take, createGig as create } from '@dito-api/skillwallet.api';

import { getGigs } from './community.api';

import { Gig } from './model';

export interface GigState {
  gigs: Gig[];
  selectedGig: Gig;
  status: ResultState;
  errorMessage: string;
}

export const fetchGigs = createAsyncThunk('gigs', async (address: string, { dispatch }) => {
  try {
    return await getGigs(address);
  } catch (error) {
    return ErrorParser(error, dispatch);
  }
});

export const takeGig = createAsyncThunk('gigs/takeGig', async (gigId: string, { dispatch, getState, rejectWithValue }) => {
  try {
    const { community }: any = getState();

    return await take(community.community.address, gigId);
  } catch (error) {
    const message = ParseSWErrorMessage(error);
    dispatch(openSnackbar({ message, severity: 'error' }));
    return rejectWithValue(message);
  }
});
export const createGig = createAsyncThunk('gigs/createGig', async (data: any, { dispatch, getState, rejectWithValue }) => {
  try {
    const { community }: any = getState();

    data.image = community.community.image;

    return await create(community.community.address, data);
  } catch (error) {
    const message = ParseSWErrorMessage(error);
    dispatch(openSnackbar({ message, severity: 'error' }));
    return rejectWithValue(message);
  }
});

const initialState: GigState = {
  status: ResultState.Idle,
  gigs: [],
  selectedGig: null,
  errorMessage: null,
};

export const gigSlice = createSlice({
  name: 'gigs',
  initialState,
  reducers: {
    resetGigState: () => initialState,
    updateGigStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigs.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        // @ts-ignore
        state.gigs = [...action.payload, ...action.payload, ...action.payload] as any;
        state.status = ResultState.Idle;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      })
      .addCase(takeGig.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(takeGig.fulfilled, (state, action) => {
        state.status = ResultState.Idle;
        (state.gigs as any[]) = state.gigs.map((gig) => {
          if (gig.id === action.payload.id) {
            return action.payload;
          }
          return gig;
        });
      })
      .addCase(takeGig.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      })
      .addCase(createGig.pending, (state) => {
        state.status = ResultState.Loading;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.selectedGig = action.payload as Gig;
        state.status = ResultState.Idle;
      })
      .addCase(createGig.rejected, (state, action) => {
        state.status = ResultState.Failed;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { resetGigState, updateGigStatus } = gigSlice.actions;

export const GigStatus = (state) => state.gigs.status;

export const GigErrorMessage = (state) => state.gigs.errorMessage;

export default gigSlice.reducer;
