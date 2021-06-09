import { apiClient } from 'helpers/api';

export const getPostComments = ({
  page, perPage, postId,
}) => apiClient
  .get('comments', {
    page,
    perPage,
    postId,
  });

export const createComment = ({ text, postId }) => apiClient
  .post('comments', { text, postId });

export const deleteComment = _id => apiClient
  .delete(`comments/${_id}`);
