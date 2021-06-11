import { apiClient } from 'helpers/api';

export const getPostComments = ({
  page, perPage, postId, createdBy,
}) => apiClient
  .get('comments', {
    page,
    perPage,
    postId,
    createdBy,
  });

export const createComment = ({ text, postId }) => apiClient
  .post('comments', { text, postId });

export const deleteComment = _id => apiClient
  .delete(`comments/${_id}`);

export const reportComment = ({ _id, message, reason }) => apiClient
  .post(`comments/${_id}/report`, { message, reason });
