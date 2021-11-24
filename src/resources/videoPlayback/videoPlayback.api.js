import { apiClient } from 'helpers/api';

export const createVideoPlayback = ({
  viewerId, postId, delayMs, networkType, os,
}) => apiClient
  .post('video-playbacks', {
    viewerId, postId, delayMs, networkType, os,
  });
