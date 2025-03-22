import type { RootState } from '../../app/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectGroups = (state: RootState) => state.groups.groups;
export const selectGroupsLoading = (state: RootState) => state.groups.loading;
export const selectGroupsError = (state: RootState) => state.groups.error;
export const selectGroupsErrorAdd = (state: RootState) => state.groups.errorAdd;
export const selectGroupsLoadingAdd = (state: RootState) =>
  state.groups.loadingAdd;
export const selectGroupById = createSelector(
  [selectGroups, (_: RootState, id: number) => id],
  (groups, id) => groups.find(group => group.vk_group_id === id),
);
