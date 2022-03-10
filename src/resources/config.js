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

const getWebUrl = () => {
  if (Config.APP_ENV !== 'DEV') {
    return Config.WEB_URL;
  }
  return Platform.OS === 'android' ? Config.ANDROID_WEB_URL : Config.IOS_WEB_URL;
};

const getLiveStreamPlayerUrl = () => {
  if (Config.APP_ENV !== 'DEV') {
    return Config.LIVE_STREAM_PLAYER_URL;
  }

  return Platform.OS === 'android' ? Config.ANDROID_LIVE_STREAM_PLAYER_URL : Config.IOS_LIVE_STREAM_PLAYER_URL;
};

export default {
  apiUrl: getApiUrl(),
  webSocketUrl: getSocketUrl(),
  webUrl: getWebUrl(),
  liveStreamPlayerUrl: getLiveStreamPlayerUrl(),
  mode: Config.APP_ENV,
  applicationId: 'fans4',
  sentryDSN: Config.SENTRY_DSN,
  iosSubscriptionPrice: Config.IOS_SUBSCRIPTION_PRICE,
};
