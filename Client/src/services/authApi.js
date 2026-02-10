import apiClient from './apiClient';

export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const signup = async (userData) => {
  const response = await apiClient.post('/auth/signup', userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};