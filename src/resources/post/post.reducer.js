import {
  UPLOADING_POST_STATUSES,
  SET_UPLOADING_POSTS_DATA,
  REMOVE_FAILED_UPLOADING_POSTS_DATA,
} from './post.constants';

export default (state = [], action) => {
  switch (action.type) {
    case SET_UPLOADING_POSTS_DATA:
      return action.updateUploadingPostsState({
        oldUploadingPostsData: state,
        uploadingPostData: action.uploadingPostData,
      });
    case REMOVE_FAILED_UPLOADING_POSTS_DATA:
      return state.filter(post => post.status !== UPLOADING_POST_STATUSES.ERROR);
    default:
      return state;
  }
};
