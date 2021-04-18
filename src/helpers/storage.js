import AsyncStorage from '@react-native-community/async-storage';

import { STORAGE_KEYS } from './constants';

export function getItem(key) {
  return AsyncStorage.getItem(key);
}

export function setItem(key, value) {
  return AsyncStorage.setItem(key, value);
}

export function removeItem(key) {
  return AsyncStorage.removeItem(key);
}

export function clear() {
  return AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
}
