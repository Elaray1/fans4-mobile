import { Platform } from 'react-native';
import Config from 'react-native-config';

const getApiUrl = () => {
  if (Config.APP_ENV !== 'DEV') {
    return Config.API_URL;
  }
  return Platform.OS === 'android' ? Config.ANDROID_API_URL : Config.IOS_API_URL;
};

const getSocketUrl = () => {
  if (Config.APP_ENV !== 'DEV') {
    return Config.WEB_SOCKET_URL;
  }
  return Platform.OS === 'android' ? Config.ANDROID_WEB_SOCKET_URL : Config.IOS_WEB_SOCKET_URL;
};

export default {
  apiUrl: getApiUrl(),
  webSocketUrl: getSocketUrl(),
  mode: Config.APP_ENV,
  applicationId: 'fans4',
};
