import { Platform } from 'react-native';
import config from 'resources/config';
import axios from 'axios';

import { STORAGE_KEYS } from 'helpers/constants';
import { getMaskedDeviceId } from 'helpers/deviceInfo';
import { setItem, clear } from 'helpers/storage';
import getInitialScreen from 'helpers/getInitialScreen';
import * as rootNavigation from 'helpers/rootNavigation';
import { throwApiError, generalError } from 'helpers/api/api.client';

import * as sockets from 'services/socket.service';
import i18n from 'services/i18n.service';

import {
  USER_LOGGED_OUT,
  SET_USER_DATA,
} from './user.constants';

import * as api from './user.api';

export const emailSignUp = ({
  email, password, userType,
}) => async (dispatch) => {
  const { user, accessToken } = await api.emailSignUp({
    email,
    password,
    userType,
  });

  config.accessToken = accessToken;

  sockets.disconnect();
  sockets.connect();
  sockets.emit('subscribe', `user-${user._id}`);

  await Promise.all([
    setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
    dispatch({ type: SET_USER_DATA, user }),
  ]);

  rootNavigation.reset({ routes: [{ name: 'AppStack', params: { screen: 'EmailConfirmation' } }] });
};

export const sendEmailConfirmation = async ({
  email,
}) => {
  await api.sendEmailConfirmation({
    email,
  });
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

export const emailSignIn = ({
  email,
  password,
  userType,
}) => async (dispatch) => {
  const deviceId = getMaskedDeviceId();

  const { user, accessToken } = await api.emailSignIn({
    email, password, userType, deviceId,
  });

  config.accessToken = accessToken;

  sockets.disconnect();
  sockets.connect();
  sockets.emit('subscribe', `user-${user._id}`);

  await Promise.all([
    setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
    dispatch({ type: SET_USER_DATA, user }),
  ]);

  const { stack, screen } = getInitialScreen(user);
  rootNavigation.reset({ routes: [{ name: stack, params: { screen } }] });

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

/* Fighters actions: start */

export const fillRegistrationForm = ({
  fullName, nickname, gender, birthdate, cityId, weight, height, reach, photo,
}) => async (dispatch) => {
  const formData = new FormData();

  formData.append('fullName', fullName);
  formData.append('nickname', nickname);
  formData.append('gender', gender);
  formData.append('birthdate', birthdate);
  formData.append('cityId', cityId);
  formData.append('weight', weight);
  formData.append('height', height);
  formData.append('reach', reach);
  formData.append('avatar', {
    name: 'image',
    type: photo?.mime,
    uri: Platform.OS === 'android' ? photo?.path : photo?.path.replace('file://', ''),
  });

  const response = await axios.request({ // TODO: change to work with api.client
    method: 'put',
    url: `${config.apiUrl}/users/registration-form`,
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      'X-Application-ID': config.applicationId,
      'X-Language': i18n.language,
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });

  if (!response) {
    throwApiError({
      data: { errors: generalError },
      status: 500,
    });

    return null;
  }

  response.data = response.data || {};
  response.status = response.status || 500;

  if (response.status >= 200 && response.status < 300) {
    dispatch({ type: SET_USER_DATA, user: response.data });
    return null;
  }
  if (response.status === 400) {
    throwApiError(response);
  }

  response.data.errors = response.data.errors || generalError;
  throwApiError(response);
};

export const updateUserInfo = ({ about }) => async (dispatch) => {
  const user = await api.updateUserInfo({ about });

  dispatch({ type: SET_USER_DATA, user });
};

export const updatePassword = async ({ oldPassword, newPassword }) => {
  await api.updatePassword({ oldPassword, newPassword });

  rootNavigation.reset({ routes: [{ name: 'AppStack', params: { screen: 'PasswordUpdated' } }] });
};

/* Fighters actions: end */

export const logout = () => async (dispatch) => {
  const deviceId = getMaskedDeviceId();

  config.accessToken = null;
  await clear();

  sockets.disconnect();
  sockets.connect();
  sockets.emit('subscribe', `device-${getMaskedDeviceId()}`);

  try {
    await api.logout({ deviceId });
  } catch (err) {
    console.error(err);
  }

  dispatch({ type: USER_LOGGED_OUT });
};

export const forgotPassword = async (email) => {
  const deviceId = getMaskedDeviceId();
  await api.forgotPassword({ email, deviceId });
};

export const resetPassword = async (password) => {
  await api.resetPassword({ password });
};
