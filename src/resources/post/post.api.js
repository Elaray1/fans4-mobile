import { apiClient } from 'helpers/api';

export const getPostsCount = () => apiClient
  .get('posts/count');

export const createPost = (data, file) => apiClient
  .postWithFile('posts', data, file);

export const getPosts = ({ page, perPage, authorId }) => apiClient
  .get('posts', {
    page,
    perPage,
    ...(authorId && { authorId }),
  });
