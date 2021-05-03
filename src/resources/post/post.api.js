import { apiClient } from 'helpers/api';

export const getPostsCount = () => apiClient
  .get('posts/count');

export const createPost = (data, file) => {
  return apiClient.postWithFile('posts', data, file);
};

export const getPosts = ({ page, perPage, my }) => apiClient
  .get('posts', {
    page,
    perPage,
    ...(my && { my }),
  });
