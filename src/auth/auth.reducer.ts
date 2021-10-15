import { ResultState } from '@dito-store/status';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { connectToEthereum, switchToEtheremNetwork } from './ethereum-network.api';
import { CommunityContract, TextileBucketMetadata } from './model';
import { claimCommunityMembershipContract, executeCommunityContract } from './skillwallet.api';
import { generateTextileBucketUrl } from './textile-bucket.api';

export interface AuthState {
  isAutheticated: boolean;
  ethereum: {
    isConnected: boolean;
    isCorrectNetwork: boolean;
    connectionStatus: ResultState;
    networkStatus: ResultState;
  };
  textile: {
    bucketUrl: string;
    status: ResultState;
  };
  skillwallet: {
    joinStatus: ResultState;
    joinError: string;
    claimStatus: ResultState;
    claimError: string;
  };
}

export const ensureEtheruemIsConnected = createAsyncThunk('ethereum/connect', () => connectToEthereum());
export const ensureEtheruemNetworkIsCorrect = createAsyncThunk('ethereum/network', () => switchToEtheremNetwork());
export const getOrCreateTextileBucket = createAsyncThunk('textile/bucket', async (metadata: TextileBucketMetadata, thunkApi) => {
  try {
    return await generateTextileBucketUrl(metadata);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const joinCommunityMembership = createAsyncThunk('skillwallet/community/join', async (metadata: CommunityContract, thunkApi) => {
  try {
    return await executeCommunityContract(metadata);
  } catch (error) {
    console.log(error, 'error');
    return thunkApi.rejectWithValue(error?.data?.message || 'Unknown error!');
  }
});

export const claimCommunityMembership = createAsyncThunk('skillwallet/community/claim', async (communityAddress: string, thunkApi) => {
  try {
    return await claimCommunityMembershipContract(communityAddress);
  } catch (error) {
    console.log(error?.data?.message, error, error.code, error.error);
    return thunkApi.rejectWithValue(error?.data?.message || 'Unknown error!');
  }
});

const initialState: AuthState = {
  isAutheticated: false,
  ethereum: {
    isConnected: false,
    isCorrectNetwork: false,
    networkStatus: ResultState.Idle,
    connectionStatus: ResultState.Idle,
  },
  textile: {
    bucketUrl: null,
    status: ResultState.Idle,
  },
  skillwallet: {
    joinStatus: ResultState.Idle,
    joinError: null,
    claimStatus: ResultState.Idle,
    claimError: null,
  },
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
    builder
      // connection
      .addCase(ensureEtheruemIsConnected.pending, (state) => {
        state.ethereum.connectionStatus = ResultState.Loading;
      })
      .addCase(ensureEtheruemIsConnected.fulfilled, (state, action) => {
        state.ethereum.isConnected = action.payload;
        state.ethereum.connectionStatus = ResultState.Idle;
      })
      .addCase(ensureEtheruemIsConnected.rejected, (state) => {
        state.ethereum.isConnected = false;
        state.ethereum.connectionStatus = ResultState.Failed;
      })
      // network
      .addCase(ensureEtheruemNetworkIsCorrect.pending, (state) => {
        state.ethereum.networkStatus = ResultState.Loading;
      })
      .addCase(ensureEtheruemNetworkIsCorrect.fulfilled, (state, action) => {
        state.ethereum.isCorrectNetwork = action.payload;
        state.ethereum.networkStatus = ResultState.Idle;
      })
      .addCase(ensureEtheruemNetworkIsCorrect.rejected, (state) => {
        state.ethereum.isCorrectNetwork = false;
        state.ethereum.networkStatus = ResultState.Failed;
      })
      // textile bucket url
      .addCase(getOrCreateTextileBucket.pending, (state) => {
        state.textile.status = ResultState.Loading;
      })
      .addCase(getOrCreateTextileBucket.fulfilled, (state, action) => {
        state.textile.bucketUrl = action.payload as string;
        state.textile.status = ResultState.Idle;
      })
      .addCase(getOrCreateTextileBucket.rejected, (state) => {
        state.textile.bucketUrl = null;
        state.textile.status = ResultState.Failed;
      })
      // skillwallet join
      .addCase(joinCommunityMembership.pending, (state) => {
        state.skillwallet.joinStatus = ResultState.Loading;
      })
      .addCase(joinCommunityMembership.fulfilled, (state) => {
        state.skillwallet.joinStatus = ResultState.Idle;
      })
      .addCase(joinCommunityMembership.rejected, (state, payload) => {
        state.skillwallet.joinStatus = ResultState.Failed;
        state.skillwallet.joinError = payload.payload as string;
      })
      // skillwallet claim
      .addCase(claimCommunityMembership.pending, (state) => {
        state.skillwallet.claimStatus = ResultState.Loading;
      })
      .addCase(claimCommunityMembership.fulfilled, (state) => {
        state.skillwallet.claimStatus = ResultState.Idle;
      })
      .addCase(claimCommunityMembership.rejected, (state, payload) => {
        state.skillwallet.claimStatus = ResultState.Failed;
        state.skillwallet.claimError = payload.payload as string;
      });
  },
});

export const { setAuthenticated, resetAuthState } = authSlice.actions;

export default authSlice.reducer;
