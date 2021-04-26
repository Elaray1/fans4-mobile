import * as api from './post.api';

export const getPostsAmount = async () => {
  const { amount: postsAmount } = await api.getPostsAmount();
  return postsAmount;
};
