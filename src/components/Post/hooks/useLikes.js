import { useEffect, useState } from 'react';

const useLikes = ({ likedUsers, userId }) => {
  const [likedUsersState, setLikedUsersState] = useState(likedUsers);
  const likesCount = likedUsersState.length;
  const isLiked = likedUsersState.some(u => u._id === userId);

  const likedNames = likedUsersState.length === 2
    ? `${likedUsersState[1]?.name} and ${likedUsersState[0]?.name}`
    : likedUsersState[0]?.name;

  useEffect(() => {
    setLikedUsersState(likedUsers);
  }, [likedUsers]);

  return {
    setLikedUsersState,
    likedUsersState,
    likesCount,
    isLiked,
    likedNames,
  };
};

export default useLikes;
