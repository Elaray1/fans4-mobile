import config from 'resources/config';

import { getMaskedDeviceId } from 'helpers/deviceInfo';

import {
  SET_USER_AUTHENTICATED,
  SET_USER_DATA,
} from './user.constants';

import * as api from './user.api';

export const emailSignUp = async ({
  email, password, userType,
}) => {
  const deviceId = getMaskedDeviceId();

  const user = await api.emailSignUp({
    email, password, userType, deviceId,
  });
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

export const setUserAuthenticated = () => (dispatch) => {
  dispatch({ type: SET_USER_AUTHENTICATED });
};

export const getUserData = () => async (dispatch) => {
  const user = await api.getUserData();
  dispatch({ type: SET_USER_DATA, user });
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
  dispatch({ type: SET_USER_AUTHENTICATED });
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
