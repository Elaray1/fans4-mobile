import { apiClient } from 'helpers/api';

export const getPostsCount = () => apiClient
  .get('posts/count');
