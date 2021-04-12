import { Platform } from 'react-native';
import * as DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

class PushNotification {
  register = async (onRegister, onNotification, onOpenNotification) => {
    await this.checkPermission(onRegister);
    let isIosEmulator = false;
    if (Platform.OS === 'ios') {
      isIosEmulator = await DeviceInfo.isEmulator();
    }
    if (!isIosEmulator) {
      this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
    }
  }

  registerAppWithFCM = async () => {
    await messaging().setAutoInitEnabled(true);
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
    }
  }

  checkPermission = async (onRegister) => {
    try {
      const permission = await messaging().hasPermission();
      const isEnabled = permission === messaging.AuthorizationStatus.AUTHORIZED
      || permission === messaging.AuthorizationStatus.PROVISIONAL;

      if (isEnabled) {
        await this.getToken(onRegister);
      } else {
        this.requestPermission(onRegister);
      }
    } catch (error) {
      console.log('[FCM] Permission rejected ', error);
    }
  }

  getToken = async (onRegister) => {
    try {
      // await messaging().deleteToken(undefined, '*');
      const token = await messaging().getToken();
      if (token) {
        await onRegister(token);
      } else {
        console.log('[FCM] User doesn\'t have a device token ');
      }
    } catch (error) {
      console.log('[FCM] getToken rejected ', error);
    }
  }

  requestPermission = async (onRegister) => {
    try {
      await messaging().requestPermission();
      this.getToken(onRegister);
    } catch (error) {
      console.log('[FCM] Request Permission rejected ', error);
    }
  }

  deleteToken = async () => {
    try {
      console.log('[FCM] deleteToken');
      await messaging().deleteToken();
    } catch (error) {
      console.log('[FCM] Delete Token error: ', error);
    }
  }

  createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
    // app is running in background mode
    messaging()
      .onNotificationOpenedApp((remoteMessage) => {
        console.log('[FCM] onNotificationOpenedApp (from a background state): ', remoteMessage);
        if (remoteMessage) {
          onOpenNotification({
            notification: remoteMessage.notification,
            data: remoteMessage.data,
          });
        }
      });

    // app is opened from a quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log('[FCM] getInitialNotification (from a quite state): ', remoteMessage);
        if (remoteMessage) {
          // onOpenNotification({
          //   notification: remoteMessage.notification,
          //   data: remoteMessage.data,
          // });
        }
      });

    this.unsubcribe = messaging()
      .onMessage((remoteMessage) => {
        console.log('[FCM] A new FCM message arrived!', remoteMessage);
        if (remoteMessage) {
          const message = {
            notification: remoteMessage.notification,
            data: remoteMessage.data,
          };
          onNotification(message);
        }
      });

    messaging().onTokenRefresh(async (token) => {
      console.log('[FCM] New Token refresh: ', token);
      await onRegister(token);
    });
  }

  unregister = () => {
    this.unsubcribe();
  }
}

export default new PushNotification();
