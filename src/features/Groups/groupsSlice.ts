import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchGroups, addGroup, addGroupNoLink } from './groupsThunks';

interface Group {
  vk_group_id: number;
  name: string;
  description: string;
  category?: string;
  subscribers_count: number;
  last_uploaded_at: string;
}

interface GroupState {
  groups: Group[];
  loading: boolean;
  error: string | null;
  loadingAdd: boolean;
  errorAdd: string | null;
}

const initialState: GroupState = {
  groups: [],
  loading: false,
  error: null,
  loadingAdd: false,
  errorAdd: null,
};

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    removeGroup: (state, action: PayloadAction<number>) => {
      state.groups = state.groups.filter(
        group => group.vk_group_id !== action.payload,
      );
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGroups.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
        state.loading = false;
      })
      .addCase(
        fetchGroups.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.error =
            typeof action.payload === 'string'
              ? action.payload
              : 'Ошибка загрузки групп';
          state.loading = false;
        },
      )
      .addCase(addGroup.pending, state => {
        state.loadingAdd = true;
        state.errorAdd = null;
      })
      .addCase(addGroup.fulfilled, (state, action) => {
        state.loadingAdd = false;
        state.groups.unshift(action.payload);
      })
      .addCase(addGroup.rejected, (state, action: PayloadAction<unknown>) => {
        state.loadingAdd = false;
        state.errorAdd =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка добавления группы';
      })
      .addCase(addGroupNoLink.pending, state => {
        state.loadingAdd = true;
        state.errorAdd = null;
      })
      .addCase(addGroupNoLink.fulfilled, (state, action) => {
        state.loadingAdd = false;
        state.groups.unshift(action.payload);
      })
      .addCase(
        addGroupNoLink.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.loadingAdd = false;
          state.errorAdd =
            typeof action.payload === 'string'
              ? action.payload
              : 'Ошибка добавления группы';
        },
      );
  },
});

export default groupSlice.reducer;
export const { removeGroup } = groupSlice.actions;
