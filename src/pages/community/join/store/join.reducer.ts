import { TextileBucketSkillsMetadata } from 'src/api/model';
import { ResultState } from '@dito-store/status';
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

import { ErrorParser } from '@dito-utils/error-parser';
import { getCategories, getCommunties, getSkills } from './join.api';
import { Category, CommunityCategory, SkillCategory } from './model';

interface Skill {
  skill: string;
  xp: number;
}

export interface JoinCommunityState {
  currentStep: {
    activeStep: number;
    title: string;
    description: string;
    toPrevBtnPath: string;
    stepperText: string;
    descriptionTooltip: string;
  };
  userInfo: {
    name: string;
    avatar: string;
  };
  category: {
    entities: Category[];
    selectedCategory: string;
    status: ResultState;
  };
  community: {
    entities: CommunityCategory[];
    communitySelectedCategory: string;
    selectedCommunityName: string;
    status: ResultState;
  };
  skills: {
    entities: SkillCategory[];
    skillSelectedCategory: string;
    selectedSkills: Skill[];
    status: ResultState;
  };
}

export const fetchCategories = createAsyncThunk('category/entities', async () => getCategories());
export const fetchSkills = createAsyncThunk('skills/entities', async (categoryId: string, { dispatch }) => {
  try {
    return await getSkills(categoryId);
  } catch (error) {
    return ErrorParser(error, dispatch);
  }
});
export const fetchCommunities = createAsyncThunk('community/entities', async (categoryId: string, { dispatch }) => {
  try {
    return await getCommunties(categoryId);
  } catch (error) {
    return ErrorParser(error, dispatch);
  }
});

const initialState: JoinCommunityState = {
  currentStep: {} as any,
  userInfo: {
    name: null,
    avatar: null,
  },
  category: {
    entities: [],
    selectedCategory: null,
    status: ResultState.Idle,
  },
  community: {
    entities: [],
    communitySelectedCategory: null,
    selectedCommunityName: null,
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
    setCurrentStep(state, action) {
      state.currentStep = action.payload;
    },
    updateName(state, action) {
      state.userInfo.name = action.payload;
    },
    updateAvatarUrl(state, action) {
      state.userInfo.avatar = action.payload;
    },
    selectCategory(state, action) {
      state.category.selectedCategory = action.payload;
    },
    selectCommunity(state, action) {
      state.community.selectedCommunityName = action.payload;
    },
    updateSkill(state, action) {
      const { skill, xp } = action.payload;
      const index = state.skills.selectedSkills.findIndex((x) => x.skill === skill);

      if (xp === 0 && index !== -1) {
        state.skills.selectedSkills.splice(index, 1);
      } else if (index === -1 && xp > 0) {
        state.skills.selectedSkills = [...state.skills.selectedSkills, action.payload];
      } else if (xp > 0) {
        state.skills.selectedSkills.splice(index, 1, action.payload);
      }
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
        state.skills.selectedSkills = [];
        state.skills.status = ResultState.Loading;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills.entities = action.payload as any[];
        state.skills.skillSelectedCategory = state.category.selectedCategory;
        state.skills.status = ResultState.Idle;
      })
      .addCase(fetchSkills.rejected, (state) => {
        state.skills.entities = [];
        state.skills.skillSelectedCategory = null;
        state.skills.status = ResultState.Failed;
      })
      .addCase(fetchCommunities.pending, (state) => {
        state.community.status = ResultState.Loading;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.community.entities = action.payload as any[];
        state.community.communitySelectedCategory = state.category.selectedCategory;
        state.community.status = ResultState.Idle;
      })
      .addCase(fetchCommunities.rejected, (state) => {
        state.community.entities = [];
        state.community.communitySelectedCategory = null;
        state.community.status = ResultState.Failed;
      });
  },
});

export const {
  selectCategory,
  resetJoinCommunityState,
  toggleSkill,
  updateSkill,
  selectCommunity,
  updateAvatarUrl,
  updateName,
  setCurrentStep,
} = joinCommunitySlice.actions;

export const getCommunity = createSelector(selectCommunity, (x1) => {
  const { entities, selectedCommunityName } = x1.payload.joinCommunity.community;
  return entities.find((e) => e.name === selectedCommunityName);
});

export const getFormattedSkills = createSelector(updateSkill, toggleSkill, (x1): TextileBucketSkillsMetadata[] => {
  const { selectedSkills } = x1.payload.joinCommunity.skills;
  return selectedSkills.reduce((prev: TextileBucketSkillsMetadata[], curr: Skill) => {
    return [
      ...prev,
      {
        name: curr.skill,
        value: curr.xp,
      },
    ];
  }, []);
});

export const getCredits = createSelector(updateSkill, toggleSkill, (x1): string => {
  const { selectedSkills, entities } = x1.payload.joinCommunity.skills;
  const totalSkillCredits = selectedSkills.reduce((prev: number, curr: Skill) => {
    const entity = entities.find(({ skills }) => skills.some((s) => s === curr.skill));
    prev += (entity?.credits || 0) * curr.xp;
    return prev;
  }, 0);
  return (totalSkillCredits + 2000).toString();
});

export const getSkillCredits = createSelector(updateSkill, toggleSkill, (x1): string => {
  const { selectedSkills, entities } = x1.payload.joinCommunity.skills;
  const totalSkills = selectedSkills.reduce((prev: any[], curr: Skill) => {
    const entity = entities.find(({ skills }) => skills.some((s) => s === curr.skill));
    prev = [
      ...prev,
      {
        value: (curr.xp / 10) * 100,
        name: curr.skill,
        credits: (entity?.credits || 0) * curr.xp,
      },
    ];
    return prev;
  }, []);

  const maxTotal = 3;
  const emptySkillNames = {
    0: 'One',
    1: 'Two',
    2: 'Three',
  };
  for (let i = totalSkills.length; i < maxTotal; i += 1) {
    totalSkills.push({
      value: 0,
      name: `Skill ${emptySkillNames[i]}`,
      credits: 0,
    });
  }

  console.log('totalSkills: ', totalSkills);

  return totalSkills;
});

export default joinCommunitySlice.reducer;
