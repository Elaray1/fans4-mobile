import * as api from './post.api';

export const getPostsCount = async () => {
  const { count: postsCount } = await api.getPostsCount();
  return postsCount;
};
