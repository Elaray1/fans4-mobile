import { apiClient } from 'helpers/api';

import { COMMENTS_FILTERS } from 'resources/comment/comment.constants';

export const getOtherPostComments = ({
  page, perPage, postId,
}) => apiClient
  .get('comments', {
    page,
    perPage,
    postId,
    filter: COMMENTS_FILTERS.OTHERS,
  });

export const getMyPostComments = ({
  postId,
}) => apiClient
  .get('comments', {
    postId,
    isMyComments: true,
    filter: COMMENTS_FILTERS.MY,
  });

export const createComment = ({ text, postId }) => apiClient
  .post('comments', { text, postId });

export const deleteComment = _id => apiClient
  .delete(`comments/${_id}`);

export const reportComment = ({ _id, message, reason }) => apiClient
  .post(`comments/${_id}/report`, { message, reason });
