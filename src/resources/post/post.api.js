import { apiClient } from 'helpers/api';

export const getPostsCount = () => apiClient
  .get('posts/count');

export const createPost = (data, file) => apiClient
  .postWithFile('posts', data, file);

export const getMyFeedPosts = ({ page, perPage }) => apiClient
  .get('posts/feed', {
    page,
    perPage,
  });

export const getFighterPosts = ({ _id, page, perPage }) => {
  return apiClient
    .get(`posts/fighter/${_id}`, {
      page,
      perPage,
    });
};

export const getMyPosts = ({ page, perPage }) => {
  return apiClient
    .get('posts/my', {
      page,
      perPage,
    });
};

export const likePost = _id => apiClient
  .post(`posts/${_id}/likes`);

export const removeLikeFromPost = _id => apiClient
  .delete(`posts/${_id}/likes`);
