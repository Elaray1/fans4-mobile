import {
  SET_UPLOADING_POSTS_DATA,
  REMOVE_FAILED_UPLOADING_POSTS_DATA,
  REMOVE_COMPLETED_UPLOADING_POSTS_DATA,
} from './post.constants';

const updateUploadingPostsState = ({ oldUploadingPostsData, uploadingPostData }) => {
  const { id } = uploadingPostData;
  if (oldUploadingPostsData.some(post => post.id === id)) {
    return oldUploadingPostsData.map(post => (post.id === id ? { ...post, ...uploadingPostData } : post));
  }
  return [
    ...oldUploadingPostsData,
    uploadingPostData,
  ];
};

export const updateUploadingPostsData = ({ id, data, file, progress, status }) => async (dispatch) => {
  const uploadingPostData = { id, data, file, progress, status };

  dispatch({ type: SET_UPLOADING_POSTS_DATA, updateUploadingPostsState, uploadingPostData });
};

export const removeFailedUploadingPosts = () => async (dispatch) => {
  dispatch({ type: REMOVE_FAILED_UPLOADING_POSTS_DATA });
};

export const removeCompletedUploadingPosts = () => async (dispatch) => {
  dispatch({ type: REMOVE_COMPLETED_UPLOADING_POSTS_DATA });
};
