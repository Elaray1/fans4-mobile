import { apiClient } from 'helpers/api';
import { Platform } from 'react-native';

import { OS_PLATFORMS } from 'resources/user/user.constants';

export const emailSignUp = ({
  email, password, userType,
}) => apiClient
  .post('users/signup', {
    email, password, userType,
  });

export const sendEmailConfirmation = ({
  email, userType,
}) => apiClient
  .post('users/send-email-confirmation', {
    email,
    userType,
  });

export const getUserData = () => apiClient
  .get('users/current');

export const getMyFans = () => apiClient.get('users/my-fans');

export const getMyFighters = ({ page, perPage } = {}) => apiClient.get('users/my-fighters', {
  page,
  perPage,
});

export const setPushToken = ({ token, deviceId }) => apiClient
  .put('users/push-token', { token, deviceId });

export const emailSignIn = ({
  email, password, userType, deviceId,
}) => apiClient
  .post('users/signin', {
    email, password, userType, deviceId, isFromMobile: true,
  });

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
}, avatar) => {
  return apiClient.postWithFile('users/registration-form', {
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
};

export const updateUserInfo = ({
  about, birthdate, fullName, userName, gender, removeIntroVideo,
}) => apiClient
  .put('users', {
    ...((about || about === '') && { about }),
    ...(birthdate && { birthdate }),
    ...(fullName && { fullName }),
    ...(userName && { userName }),
    ...(gender && { gender }),
    ...(removeIntroVideo && { removeIntroVideo }),
  });

export const completeOnboarding = () => {
  return apiClient.put('users/onboarding');
};

export const logout = ({ deviceId }) => apiClient
  .post('users/logout', { deviceId });

export const forgotPassword = ({ email, deviceId, userType }) => apiClient
  .post('users/password-reset-email', { email, deviceId, userType });

export const resetPassword = ({ password, resetPasswordToken }) => apiClient
  .put('users/password/reset', { password, resetPasswordToken });

export const updatePassword = ({ oldPassword, newPassword }) => apiClient
  .put('users/password', { oldPassword, newPassword });

export const updateEmail = ({ newEmail, password }) => apiClient
  .put('users/email', { newEmail, password });

export const getFighters = ({ page, perPage, searchValue }) => apiClient
  .get('users/fighters', { page, perPage, searchValue });

export const getFighter = ({ _id }) => apiClient
  .get(`users/fighter/${_id}`);

export const getFightersForFight = ({ opponentId, search }) => apiClient
  .get('users/fighters-for-fight', {
    opponentId,
    ...(search && { search }),
  });

export const hideBankAccountWarning = () => apiClient
  .put('users/bank-account-warning');

export const suggestFight = ({ firstFighterId, secondFighterId }) => apiClient
  .post('fights/suggest', { firstFighterId, secondFighterId });

export const getPasswordResetToken = ({ deviceId, email }) => apiClient
  .get('users/password-reset-token-checking', { deviceId, email });

export const addIntroVideo = (data, file, { onUploadProgress }) => {
  return apiClient.postWithFileInBackground('users/intro-video', data, file,
    { onUploadProgress });
};

export const acceptTermsOfUse = () => {
  return apiClient.put('users/terms-of-use');
};

export const updateLastUsedOs = () => {
  const lastUsedOs = Platform.OS === 'ios' ? OS_PLATFORMS.IOS : OS_PLATFORMS.ANDROID;

  return apiClient.put('users/os', { lastUsedOs });
};
