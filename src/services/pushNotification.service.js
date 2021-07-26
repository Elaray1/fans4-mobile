// The app can be in three states: foreground, background, closed
// The app can receive firebase messages in all three states
// but system shows firebase push notifications only when is in background or closed, so:
// messaging().getInitialNotification() - handler for closed state;
// messaging().onNotificationOpenedApp - handler background state;
// messaging().onMessage() - handler for foreground state;
// Since onMessage() doesn't show notification by default we force it by PushNotification.localNotification
// Also it's required to call PushNotification.configure() outside react lifecycle so:
// Firstly we initiaize firebase and local push notifications then we import service to use it within React
// For details check docs react-native-firebase and react-native-push-notification
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import Config from 'react-native-config';


import { getMaskedDeviceId } from 'helpers/deviceInfo';

import * as userApi from 'resources/user/user.api';

const NOTIFICATION_CHANNEL_ID = `fans4_${Config.APP_ENV}`;
const NOTIFICATION_CHANNEL_NAME = `Fans4_${Config.APP_ENV}`;

const createNotificationChannelAsync = () => {
  return new Promise((resolve) => {
    PushNotification.createChannel({
      channelId: NOTIFICATION_CHANNEL_ID,
      channelName: NOTIFICATION_CHANNEL_NAME,
    }, isCreated => resolve(isCreated));
  });
};

class PushNotificationService {
  constructor(injectedUserApiService) {
    this.userApiService = injectedUserApiService;
  }

  async _updatePushNotificationToken(token) {
    const deviceId = getMaskedDeviceId();

    try {
      await this.userApiService.setPushToken({ token, deviceId });
    } catch (err) {
      console.error('Failed to update push notification tokens');
    }
  }

  stopNotificationHandling() {
    this.notificationHandlers = null;

    if (this.unsubscribeOnTokenRefresh) {
      this.unsubscribeOnTokenRefresh();
    }

    if (this.unsubscribeOnMessage) {
      this.unsubscribeOnMessage();
    }

    if (this.unsubscribeonNotificationOpenedApp) {
      this.unsubscribeonNotificationOpenedApp();
    }
  }

  async startNotificationHandling(notificationHandlers) {
    this.notificationHandlers = notificationHandlers;

    if (Platform.OS === 'android') {
      await createNotificationChannelAsync();
    }

    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED
        || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.error('Push notifications are not enabled by user');
      }
    }

    const token = await messaging().getToken();
    await this._updatePushNotificationToken(token);
    this.unsubscribeOnTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      await this._updatePushNotificationToken(newToken);
    });


    const handleNotification = (notification) => {
      if (this.notificationHandlers[notification.data.type]) {
        this.notificationHandlers[notification.data.type]();
      }
    };

    this.unsubscribeOnMessage = messaging().onMessage((message) => {
      PushNotification.localNotification({
        channelId: NOTIFICATION_CHANNEL_ID,
        message: message.notification.body || '', // it doesn't work with undefined for some reason
        title: message.notification.title,
        userInfo: message.data,
      });
    });

    this.unsubscribeonNotificationOpenedApp = messaging().onNotificationOpenedApp((message) => {
      handleNotification(message.data);
    });

    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      handleNotification(initialNotification);
    }
  }
}

const pushNotificationService = new PushNotificationService(userApi);

PushNotification.configure({
  onNotification(notification) {
    console.log('onNotification', notification);
    if (pushNotificationService.notificationHandlers[notification.data.type]) {
      pushNotificationService.notificationHandlers[notification.data.type](notification.data);
    }

    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
});

export default pushNotificationService;
