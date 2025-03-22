import axios from 'axios';
import { API_URL } from './link';
import { store } from '../../app/store';
import { selectToken } from '../../features/Auth/authSelectors';
import type { myFormData } from '../../features/Groups/types';

const apiInstance = axios.create({
  baseURL: API_URL,
});

apiInstance.interceptors.request.use(config => {
  const state = store.getState();
  const token = selectToken(state);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const groupApi = {
  fetchGroups: async () => {
    const response = await apiInstance.get('/groups/user_groups');

    return response.data;
  },

  processLink: async (link: string) => {
    const response = await apiInstance.post(
      `/vk/parse_and_save?community_link=${encodeURIComponent(link)}`,
    );

    return response.data.group;
  },

  createGroup: async (data: myFormData) => {
    const response = await apiInstance.post(
      '/vk/create_virtual_group',
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.group;
  },

  updateCommunityData: async (communityId: number) => {
    const response = await apiInstance.post(
      `/vk/update_community_data?community_id=${encodeURIComponent(communityId)}`,
    );

    return response.data.group;
  },

  deleteGroup: async (vkGroupId: number) => {
    const response = await apiInstance.delete(
      `/groups/user_groups/${vkGroupId}`,
    );

    return response.data;
  },
};
