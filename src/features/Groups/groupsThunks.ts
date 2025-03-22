import { createAsyncThunk } from '@reduxjs/toolkit';
import { groupApi } from '../../shared/api/groupApi';
import type { myFormData } from './types';
import axios from 'axios';

export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async (_, { rejectWithValue }) => {
    try {
      return await groupApi.fetchGroups();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.detail || 'Ошибка загрузки групп',
        );
      }

      return rejectWithValue('Ошибка загрузки групп');
    }
  },
);

export const addGroup = createAsyncThunk(
  'groups/addGroup',
  async (link: string, { rejectWithValue }) => {
    try {
      return await groupApi.processLink(link);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.detail || 'Ошибка добавления группы',
        );
      }

      return rejectWithValue('Ошибка добавления группы');
    }
  },
);

export const addGroupNoLink = createAsyncThunk(
  'groups/addGroupNoLink',
  async (formData: myFormData, { rejectWithValue }) => {
    try {
      return await groupApi.createGroup(formData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.detail || 'Ошибка добавления группы',
        );
      }

      return rejectWithValue('Ошибка добавления группы');
    }
  },
);
