import { apiClient } from 'helpers/api';

export const getPostComments = ({
  page, perPage, postId, createdBy, sortOption,
}) => apiClient
  .get('comments', {
    page,
    perPage,
    postId,
    createdBy,
    sortOption,
  });

export const createComment = ({ text, postId, targetCommentId }) => apiClient
  .post('comments', { text, postId, targetCommentId });

export const deleteComment = _id => apiClient
  .delete(`comments/${_id}`);

export const reportComment = ({ _id, message, reason }) => apiClient
  .post(`comments/${_id}/report`, { message, reason });

export const likeComment = _id => apiClient
  .post(`comments/${_id}/likes`);

export const removeLikeFromComment = _id => apiClient
  .delete(`comments/${_id}/likes`);

export const getCommentsById = _id => apiClient
  .get(`comments/${_id}/id`);
