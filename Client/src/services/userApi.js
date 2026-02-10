import apiClient from './apiClient';

export const getUser = async () => {
  const response = await apiClient.get('/users');
  return response.data[0]; 
};

export const createUser = async (userData) => {
  const response = await apiClient.post('/users', userData);
  return response.data;
};