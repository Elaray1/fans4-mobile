import * as userActions from 'resources/user/user.actions';

import * as socketService from 'services/socket.service';

import firebasePushNotificationService from 'services/firebase.pushNotification.service';
import localPushNotificationService from 'services/local.pushNotification.service';

import { getMaskedDeviceId } from 'helpers/deviceInfo';

export const initAppSockets = async ({ dispatch }) => {
  if (socketService.disconnected()) {
    socketService.connect();
  }
  socketService.emit('subscribe', `device-${getMaskedDeviceId()}`);

  socketService.on('email:verified', async (updatedUser) => {
    await Promise.all([
      dispatch(userActions.setUserData(updatedUser)),
      userActions.removeVerificationDeviceId(),
    ]);
  });
};

export const registerPushNotifications = () => {
  const onRegister = async (pushNotificationToken) => {
    await userActions.setPushToken(pushNotificationToken);
  };

  const onNotification = (message) => {
    console.log('[App] onNotification: ', message);

    const options = {
      soundName: 'default',
      playSound: true,
    };

    if (message.notification) {
      localPushNotificationService.showNotification(
        Number(Math.random().toString().substr(2, 9)),
        message.notification.title,
        message.notification.body,
        message.data,
        options,
      );
    }
  };

  const onOpenNotification = async (message) => {
    console.log('[App] onOpenNotification: ', message);
  };

  (async () => {
    await firebasePushNotificationService.registerAppWithFCM();
    await firebasePushNotificationService.register(
      onRegister, onNotification, onOpenNotification,
    );
    localPushNotificationService.configure(onOpenNotification);
  })();
};

export const unregisterPushNotifications = () => {
  firebasePushNotificationService.unregister();
  localPushNotificationService.unregister();
};
