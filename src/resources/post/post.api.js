import { apiClient } from 'helpers/api';

export const getPostsCount = () => apiClient
  .get('posts/count');

export const createPost = (data, file) => {
  return apiClient.postWithFile('posts/', data, file);
};
