import apiClient from './apiClient';

export const getTasks = async () => {
  const response = await apiClient.get('/tasks');
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await apiClient.patch(`/tasks/${id}`, { status });
  return response.data;
};