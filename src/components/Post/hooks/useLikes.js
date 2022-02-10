import { useEffect, useState } from 'react';

import * as postApi from 'resources/post/post.api';
import { emitter, EMITTER_EVENTS } from 'services/emitter.service';

const useLikes = ({ likedUsers, userId, postId: currentPostId }) => {
  const [likedUsersState, setLikedUsersState] = useState(likedUsers);
  const likesCount = likedUsersState.length;
  const isLiked = likedUsersState.some(u => u._id === userId);

  const likedNames = likedUsersState.length === 2
    ? `${likedUsersState[1]?.name} and ${likedUsersState[0]?.name}`
    : likedUsersState[0]?.name;

  useEffect(() => {
    setLikedUsersState(likedUsers);
  }, [likedUsers]);

  useEffect(() => {
    const updateLikes = async ({ postId: changedPostId }) => {
      if (currentPostId !== changedPostId) {
        return;
      }

      try {
        const { likedUsers: fetchedLikedUsers } = await postApi.getPost(currentPostId);
        setLikedUsersState(fetchedLikedUsers);
      } catch (err) {
        console.error('Fething post err:', err);
      }
    };

    emitter.on(EMITTER_EVENTS.USER_TOGGLED_LIKE, updateLikes);
    return () => emitter.off(EMITTER_EVENTS.USER_TOGGLED_LIKE, updateLikes);
  }, [currentPostId]);

  return {
    setLikedUsersState,
    likedUsersState,
    likesCount,
    isLiked,
    likedNames,
  };
};

export default useLikes;
