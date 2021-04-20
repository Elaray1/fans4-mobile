import config from 'resources/config';

import { STORAGE_KEYS } from 'helpers/constants';
import { getMaskedDeviceId } from 'helpers/deviceInfo';
import { setItem, clear } from 'helpers/storage';

import {
  SET_USER_DATA,
  USER_LOGGED_OUT,
} from './user.constants';

import * as api from './user.api';

export const emailSignUp = ({
  email, password, userType,
}) => async (dispatch) => {
  const deviceId = getMaskedDeviceId();
  const { user, accessToken } = await api.emailSignUp({
    email, password, userType, deviceId,
  });
  config.accessToken = accessToken;

  await Promise.all([
    setItem(STORAGE_KEYS.USER_TYPE, userType),
    setItem(STORAGE_KEYS.USER_EMAIL, email),
    setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
    dispatch({ type: SET_USER_DATA, user }),
  ]);

  return user;
};

export const sendEmailConfirmation = async ({
  email,
}) => {
  await api.sendEmailConfirmation({
    email,
  });
};

export const fetchAccessToken = async () => {
  const deviceId = getMaskedDeviceId();
  const { accessToken } = await api.fetchAccessToken({ deviceId });
  return accessToken;
};

export const getUserData = () => async (dispatch) => {
  const user = await api.getUserData();
  await dispatch({ type: SET_USER_DATA, user });
  return user;
};

export const setUserData = user => async (dispatch) => {
  await dispatch({ type: SET_USER_DATA, user });
  return user;
};

export const removeVerificationDeviceId = async () => {
  const deviceId = getMaskedDeviceId();
  await api.removeVerificationDeviceId(deviceId);
};

export const emailSignIn = ({ email, password, userType }) => async (dispatch) => {
  const deviceId = getMaskedDeviceId();
  const { user, accessToken } = await api.emailSignIn({
    email, password, userType, deviceId,
  });
  config.accessToken = accessToken;
  await Promise.all([
    setItem(STORAGE_KEYS.USER_TYPE, userType),
    setItem(STORAGE_KEYS.USER_EMAIL, email),
    setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
    dispatch({ type: SET_USER_DATA, user }),
  ]);
  return user;
};

export const getUsers = async ({ role, status }) => {
  const users = await api.getUsers({ role, status });
  return users;
};

export const setPushToken = async (token) => {
  const deviceId = getMaskedDeviceId();
  await api.setPushToken({ token, deviceId });
};

export const logout = () => async (dispatch) => {
  // await api.logout(); // add logout endpoint
  config.accessToken = null;
  await clear();
  dispatch({ type: USER_LOGGED_OUT });
};
