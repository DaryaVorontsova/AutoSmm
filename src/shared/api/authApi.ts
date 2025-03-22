import axios from 'axios';
import { API_URL } from './link';

export const authApi = {
  register: async (username: string, email: string, password: string) => {
    return axios.post(`${API_URL}/users/register`, {
      username,
      email,
      password,
    });
  },

  login: async (email: string, password: string) => {
    return axios.post(`${API_URL}/users/login`, { email, password });
  },
};
