import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories, getSkills } from "./join.api";

export interface JoinCommunityState {
  category: {
    entities: { id: number; name: string }[];
    selected: string;
    status: "idle" | "loading" | "failed";
  };
  skills: {
    entities: any[];
    selectedSkills: { skill: string; xp: number }[];
    status: "idle" | "loading" | "failed";
  };
}

export const fetchCategories = createAsyncThunk(
  "category/entities",
  async () => await getCategories()
);

export const fetchSkills = createAsyncThunk(
  "skills/entities",
  async (categoryId: string) => await getSkills(categoryId)
);

const initialState: JoinCommunityState = {
  category: {
    entities: [],
    selected: null,
    status: "idle",
  },
  skills: {
    entities: [],
    selectedSkills: [],
    status: "idle",
  },
};

export const joinCommunitySlice = createSlice({
  name: "joinCommunity",
  initialState,
  reducers: {
    selectCategory(state, action) {
      state.category.selected = action.payload;
    },
    updateSkill(state, action) {
      const { skill } = action.payload;
      const index = state.skills.selectedSkills.findIndex(
        (x) => x.skill === skill
      );
      state.skills.selectedSkills.splice(index, 0, action.payload);
    },
    toggleSkill(state, action) {
      const index = state.skills.selectedSkills.findIndex(
        (x) => x.skill === action.payload
      );
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
    resetJoinCommunityState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state, action) => {
        state.category.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.category.entities = action.payload as any[];
        state.category.status = "idle";
      })
      .addCase(fetchSkills.pending, (state, action) => {
        state.skills.status = "loading";
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills.entities = action.payload as any[];
        state.skills.status = "idle";
      });
  },
});

export const {
  selectCategory,
  resetJoinCommunityState,
  toggleSkill,
  updateSkill,
} = joinCommunitySlice.actions;

export default joinCommunitySlice.reducer;
