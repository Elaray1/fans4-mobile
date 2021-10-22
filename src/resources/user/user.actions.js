import config from 'resources/config';

import { STORAGE_KEYS } from 'helpers/constants';
import { getMaskedDeviceId } from 'helpers/deviceInfo';
import { setItem, clear } from 'helpers/storage';
import getInitialScreen from 'helpers/getInitialScreen';
import * as rootNavigation from 'helpers/rootNavigation';

import * as sockets from 'services/socket.service';
import analyticsService from 'services/analytics.service';

import {
  USER_LOGGED_OUT,
  SET_USER_DATA,
  USER_TYPES,
  SET_USER_SUBSCRIPTIONS,
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

  analyticsService.logEvent({ name: analyticsService.events.FIGHTER_SIGNED_UP });

  rootNavigation.reset({ routes: [{ name: 'AppStack', params: { screen: 'EmailConfirmation' } }] });
};

export const sendEmailConfirmation = async ({
  email, userType,
}) => {
  await api.sendEmailConfirmation({
    email,
    userType,
  });
};

export const getUserData = () => async (dispatch) => {
  const user = await api.getUserData();

  dispatch({ type: SET_USER_DATA, user });
  return user;
};

export const setUserData = user => (dispatch) => {
  dispatch({ type: SET_USER_DATA, user });
  return user;
};

export const setFanSubscriptions = (fighters = []) => (dispatch) => {
  dispatch({ type: SET_USER_SUBSCRIPTIONS, fighters });
};

export const emailSignIn = ({
  email,
  password,
  userType,
}) => async (dispatch) => {
  if (userType === USER_TYPES.FAN) {
    analyticsService.logEvent({
      name: analyticsService.events.SIGN_IN_AS_FAN_PRESSED,
    });
  }

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

export const setPushToken = async (token) => {
  const deviceId = getMaskedDeviceId();
  await api.setPushToken({ token, deviceId });
};

export const fillRegistrationForm = ({
  fullName,
  nickname,
  gender,
  birthdate,
  cityId,
  weight,
  height,
  reach,
  fighterType,
  wins,
  losses,
  draws,
  winsPro,
  lossesPro,
  drawsPro,
  weightClasses,
  avatar,
}) => async (dispatch) => {
  const user = await api.fillRegistrationForm({
    fullName,
    nickname,
    gender,
    birthdate,
    cityId,
    weight,
    height,
    reach,
    fighterType,
    wins,
    losses,
    draws,
    winsPro,
    lossesPro,
    drawsPro,
    weightClasses,
  }, avatar);

  dispatch({ type: SET_USER_DATA, user });
};

export const updateUserInfo = ({
  about, birthdate, fullName, userName, gender,
}) => async (dispatch) => {
  const user = await api.updateUserInfo({
    about, birthdate, fullName, userName, gender,
  });
  dispatch({ type: SET_USER_DATA, user });
};

export const updatePassword = async ({ oldPassword, newPassword }) => {
  await api.updatePassword({ oldPassword, newPassword });
  rootNavigation.reset({ routes: [{ name: 'AppStack', params: { screen: 'PasswordUpdated' } }] });
};

export const logout = () => async (dispatch) => {
  const deviceId = getMaskedDeviceId();

  try {
    await api.logout({ deviceId });
  } catch (err) {
    console.error(err);
  }

  await clear();
  config.accessToken = null;
  sockets.disconnect();
  sockets.connect();
  sockets.emit('subscribe', `device-${deviceId}`);

  dispatch({ type: USER_LOGGED_OUT });
};

export const updateEmail = ({ newEmail, password }) => async (dispatch) => {
  const user = await api.updateEmail({ newEmail, password });

  rootNavigation.reset({ routes: [{ name: 'AppStack', params: { screen: 'ConfirmYourEmailAddress' } }] });

  dispatch({ type: SET_USER_DATA, user });
};
