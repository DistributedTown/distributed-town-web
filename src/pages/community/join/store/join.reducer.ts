import { ResultState } from '@dito-store/status';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getCategories, getCommunties, getSkills } from './join.api';
import { Category, CommunityCategory, SkillCategory } from './model';

export interface JoinCommunityState {
  category: {
    entities: Category[];
    selectedCategory: string;
    status: ResultState;
  };
  community: {
    entities: CommunityCategory[];
    communitySelectedCategory: string;
    selectedCommunity: string;
    status: ResultState;
  };
  skills: {
    entities: SkillCategory[];
    skillSelectedCategory: string;
    selectedSkills: { skill: string; xp: number }[];
    status: ResultState;
  };
}

export const fetchCategories = createAsyncThunk('category/entities', async () => getCategories());
export const fetchSkills = createAsyncThunk('skills/entities', async (categoryId: string) => getSkills(categoryId));
export const fetchCommunities = createAsyncThunk('community/entities', async (categoryId: string) => getCommunties(categoryId));

const initialState: JoinCommunityState = {
  category: {
    entities: [],
    selectedCategory: null,
    status: ResultState.Idle,
  },
  community: {
    entities: [],
    communitySelectedCategory: null,
    selectedCommunity: null,
    status: ResultState.Idle,
  },
  skills: {
    skillSelectedCategory: null,
    entities: [],
    selectedSkills: [],
    status: ResultState.Idle,
  },
};

export const joinCommunitySlice = createSlice({
  name: 'joinCommunity',
  initialState,
  reducers: {
    selectCategory(state, action) {
      state.category.selectedCategory = action.payload;
    },
    selectCommunity(state, action) {
      state.community.selectedCommunity = action.payload;
    },
    updateSkill(state, action) {
      const { skill } = action.payload;
      const index = state.skills.selectedSkills.findIndex((x) => x.skill === skill);
      state.skills.selectedSkills.splice(index, 1, action.payload);
    },
    toggleSkill(state, action) {
      const index = state.skills.selectedSkills.findIndex((x) => x.skill === action.payload);
      if (index === -1) {
        state.skills.selectedSkills = [
          ...state.skills.selectedSkills,
          {
            skill: action.payload,
            xp: 0,
          },
        ];
      } else {
        state.skills.selectedSkills.splice(index, 1);
      }
    },
    resetJoinCommunityState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.category.status = ResultState.Loading;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.category.entities = action.payload as any[];
        state.category.status = ResultState.Idle;
      })
      .addCase(fetchSkills.pending, (state) => {
        state.skills.status = ResultState.Loading;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills.entities = action.payload as any[];
        state.skills.skillSelectedCategory = state.category.selectedCategory;
        state.skills.status = ResultState.Idle;
      })
      .addCase(fetchCommunities.pending, (state) => {
        state.community.status = ResultState.Loading;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.community.entities = action.payload as any[];
        state.community.communitySelectedCategory = state.category.selectedCategory;
        state.community.status = ResultState.Idle;
      });
  },
});

export const { selectCategory, resetJoinCommunityState, toggleSkill, updateSkill, selectCommunity } = joinCommunitySlice.actions;

export default joinCommunitySlice.reducer;
