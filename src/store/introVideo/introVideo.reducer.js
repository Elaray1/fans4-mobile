import {
  START_UPLOADING_INTRO_VIDEO_DATA,
  SET_UPLOADING_INTRO_VIDEO_DATA,
  DELETE_UPLOADING_INTRO_VIDEO_DATA,
} from './introVideo.constants';


export default (state = null, action) => {
  switch (action.type) {
    case START_UPLOADING_INTRO_VIDEO_DATA:
      return action.introVideoData;
    case SET_UPLOADING_INTRO_VIDEO_DATA:
      if (state) {
        return action.introVideoData;
      }
      return state;
    case DELETE_UPLOADING_INTRO_VIDEO_DATA:
      return null;
    default:
      return state;
  }
};
