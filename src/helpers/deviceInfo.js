import { getUniqueId } from 'react-native-device-info';
import { Platform } from 'react-native';

export const getMaskedDeviceId = () => {
  const deviceId = getUniqueId();
  const prefix = Platform.OS === 'android' ? 'wkd' : 'WKD';
  const postfix = '7';
  return `${prefix}${deviceId}${postfix}`;
};
