import {
  SET_UPLOADING_POSTS_DATA,
  REMOVE_FAILED_UPLOADING_POSTS_DATA,
  REMOVE_COMPLETED_UPLOADING_POSTS_DATA,
} from './post.constants';

export const updateUploadingPostsData = ({ id, data, file, progress, status }) => async (dispatch) => {
  const uploadingPostData = { id, data, file, progress, status };

  dispatch({ type: SET_UPLOADING_POSTS_DATA, uploadingPostData });
};

export const removeFailedUploadingPosts = () => async (dispatch) => {
  dispatch({ type: REMOVE_FAILED_UPLOADING_POSTS_DATA });
};

export const removeCompletedUploadingPosts = () => async (dispatch) => {
  dispatch({ type: REMOVE_COMPLETED_UPLOADING_POSTS_DATA });
};
