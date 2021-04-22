import React, {
  useCallback, useState,
} from 'react';
import {
  View, TouchableOpacity, StatusBar,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import axios from 'axios';

import config from 'resources/config';
import colors from 'themes/colors';

import Text from 'components/Text';

import { CONTENT_TYPES } from 'resources/posts/posts.constants';

import styles from './VideoExample.styles';

function VideoExample() {
  const [videoData, setVideoData] = useState(null);
  const [loadingPercent, setLoadingPercent] = useState(null);

  const videoError = useCallback((e) => {
    console.log(e);
  }, []);

  const onUploadVideo = useCallback(async () => {
    const options = {
      mediaType: 'video',
    };
    const fetchedVideoData = await ImagePicker.openPicker(options);
    setVideoData(fetchedVideoData);
  }, []);

  const onSendVideo = useCallback(async () => {
    const formData = new FormData();

    formData.append('file', {
      name: CONTENT_TYPES.VIDEO,
      type: videoData.mime,
      uri: videoData.path,
    });

    axios.request({
      method: 'post',
      url: `${config.apiUrl}/posts/?contentType=${CONTENT_TYPES.VIDEO}`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
      onUploadProgress: (progress) => {
        const percentageProgress = progress.loaded / progress.total * 100;
        setLoadingPercent(percentageProgress.toFixed(0));
      },
    }).then(() => {
      // video has been uploaded
      setLoadingPercent(null);
    }).catch(error => console.log(error));
  }, [videoData]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.main} />
      <TouchableOpacity
        onPress={onUploadVideo}
        style={styles.button}
      >
        <Text>Upload Video</Text>
      </TouchableOpacity>
      <View>
        <Video
          resizeMode="cover"
          source={{ uri: `${config.apiUrl}/posts/id_example/video` }}
          onError={videoError} // Callback when video cannot be loaded
          style={styles.video}
          ignoreSilentSwitch="ignore"
        />
      </View>
      {videoData && (
        <TouchableOpacity
          onPress={onSendVideo}
          style={styles.button}
        >
          <Text>Send Video</Text>
        </TouchableOpacity>
      )}
      {loadingPercent !== null && <Text>{loadingPercent}</Text>}
    </View>
  );
}

export default VideoExample;
