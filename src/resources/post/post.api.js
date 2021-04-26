import { apiClient } from 'helpers/api';

export const getPostsAmount = () => apiClient
  .get('posts/amount');
