import {
  SET_UPLOADING_INTRO_VIDEO_DATA,
  DELETE_UPLOADING_INTRO_VIDEO_DATA,
} from './introVideo.constants';

export const updateUploadingIntroVideoData = ({ id, data, file, progress, status }) => async (dispatch) => {
  const introVideoData = { id, data, file, progress, status };

  dispatch({ type: SET_UPLOADING_INTRO_VIDEO_DATA, introVideoData });
};

export const removeUploadingIntroVideoData = () => async (dispatch) => {
  dispatch({ type: DELETE_UPLOADING_INTRO_VIDEO_DATA });
};
