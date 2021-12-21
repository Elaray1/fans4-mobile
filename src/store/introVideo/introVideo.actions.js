import { Platform } from 'react-native';

// react-native-background-upload with version (github:cristianoccazinspd) not working for android
import backgroundUploaderIOS from 'react-native-background-upload';
import backgroundUploaderAndroid from 'react-native-background-upload-android';

import {
  START_UPLOADING_INTRO_VIDEO_DATA,
  SET_UPLOADING_INTRO_VIDEO_DATA,
  DELETE_UPLOADING_INTRO_VIDEO_DATA,
} from './introVideo.constants';

export const startUploadingIntroVideoData = ({ data, file, progress, status, uploadId }) => async (dispatch) => {
  const introVideoData = { data, file, progress, status, uploadId };

  dispatch({ type: START_UPLOADING_INTRO_VIDEO_DATA, introVideoData });
};

export const updateUploadingIntroVideoData = ({ id, data, file, progress, status, uploadId }) => async (dispatch) => {
  const introVideoData = { id, data, file, progress, status, uploadId };

  dispatch({ type: SET_UPLOADING_INTRO_VIDEO_DATA, introVideoData });
};

export const cancelUploadingIntroVideoData = uploadId => async (dispatch) => {
  const backgroundUploader = Platform.OS === 'ios' ? backgroundUploaderIOS : backgroundUploaderAndroid;

  await backgroundUploader.cancelUpload(uploadId);

  dispatch({ type: DELETE_UPLOADING_INTRO_VIDEO_DATA });
};

export const removeUploadingIntroVideoData = () => async (dispatch) => {
  dispatch({ type: DELETE_UPLOADING_INTRO_VIDEO_DATA });
};
