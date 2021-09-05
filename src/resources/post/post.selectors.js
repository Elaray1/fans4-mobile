import { createSelector } from 'reselect';
import { MEDIA_UPLOADING_STATUSES } from 'helpers/constants';

export const getPosts = ({ post }) => post;

export const getUploadingPosts = createSelector(
  getPosts,
  posts => posts.filter((post) => {
    return post.status === MEDIA_UPLOADING_STATUSES.UPLOADING
        || post.status === MEDIA_UPLOADING_STATUSES.ERROR;
  }),
);

export const getCompletedUploadingPosts = createSelector(
  getPosts,
  posts => posts.filter((post) => {
    return post.status === MEDIA_UPLOADING_STATUSES.COMPLETED;
  }),
);
