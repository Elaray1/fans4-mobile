import { MEDIA_UPLOADING_STATUSES } from 'helpers/constants';

import {
  SET_UPLOADING_POSTS_DATA,
  REMOVE_FAILED_UPLOADING_POSTS_DATA,
  REMOVE_COMPLETED_UPLOADING_POSTS_DATA,
} from './post.constants';


export default (state = [], action) => {
  switch (action.type) {
    case SET_UPLOADING_POSTS_DATA:
      if (state.some(post => post.id === action.uploadingPostData.id)) {
        return state.map(post => (post.id === action.uploadingPostData.id
          ? { ...post, ...action.uploadingPostData } : post));
      }
      return [
        ...state,
        action.uploadingPostData,
      ];
    case REMOVE_FAILED_UPLOADING_POSTS_DATA:
      return state.filter(post => post.status !== MEDIA_UPLOADING_STATUSES.ERROR);
    case REMOVE_COMPLETED_UPLOADING_POSTS_DATA:
      return state.filter(post => post.status !== MEDIA_UPLOADING_STATUSES.COMPLETED);
    default:
      return state;
  }
};
