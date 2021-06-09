export const sortComments = ({ comments, userId }) => {
  const sortedComments = comments.sort((a, b) => {
    if (a.author._id === b.author._id) {
      if (a.author._id === userId) {
        if (a.createdOn > b.createdOn) {
          return -1;
        }
        return 0;
      }
    }

    if (a.author._id !== b.author._id) {
      if (a.author._id === userId) {
        return -1;
      }
      if (b.author._id === userId) {
        return 1;
      }
    }

    if (a.createdOn > b.createdOn) {
      return 1;
    }

    return 0;
  });

  return sortedComments;
};
