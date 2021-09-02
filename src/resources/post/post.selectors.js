import { UPLOADING_POST_STATUSES } from 'resources/post/post.constants';

export const getUloadingPosts = ({ post }) => post.filter((item) => {
  return item.status === UPLOADING_POST_STATUSES.UPLOADING
      || item.status === UPLOADING_POST_STATUSES.ERROR;
});

export const getCompletedUploadingPosts = ({ post }) => post.filter((item) => {
  return item.status === UPLOADING_POST_STATUSES.COMPLETED;
});
