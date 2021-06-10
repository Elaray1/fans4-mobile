import { apiClient } from 'helpers/api';

export const getOtherPostComments = ({
  page, perPage, postId,
}) => apiClient
  .get('comments', {
    page,
    perPage,
    postId,
    isMyComments: false,
  });

export const getMyPostComments = ({
  postId,
}) => apiClient
  .get('comments', {
    postId,
    isMyComments: true,
  });

export const createComment = ({ text, postId }) => apiClient
  .post('comments', { text, postId });

export const deleteComment = _id => apiClient
  .delete(`comments/${_id}`);

export const reportComment = ({ _id, message, reason }) => apiClient
  .post(`comments/${_id}/report`, { message, reason });
