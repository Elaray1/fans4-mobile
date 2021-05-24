import { apiClient } from 'helpers/api';

export const emailSignUp = ({
  email, password, userType,
}) => apiClient
  .post('users/signup', {
    email, password, userType,
  });

export const sendEmailConfirmation = ({
  email,
}) => apiClient
  .post('users/send-email-confirmation', {
    email,
  });

export const getUserData = () => apiClient
  .get('users/current');

export const getUsers = ({ page, perPage, myFans }) => apiClient
  .get('users', {
    page,
    perPage,
    ...(myFans && { myFans }),
  });

export const getUsersCount = ({ myFans }) => apiClient
  .get('users/count', {
    ...(myFans && { myFans }),
  });

export const setPushToken = ({ token, deviceId }) => apiClient
  .put('users/push-token', { token, deviceId });

export const emailSignIn = ({
  email, password, userType, deviceId,
}) => apiClient
  .post('users/signin', {
    email, password, userType, deviceId,
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
    weightClasses,
  }, avatar);
};

export const updateUserInfo = ({
  about,
}) => apiClient
  .put('users/', {
    about,
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

export const getOtherFighters = ({ page, perPage, searchValue }) => apiClient
  .get('users/other-fighters', { page, perPage, searchValue });

export const getOtherFighter = ({ _id }) => apiClient
  .get(`users/${_id}`);
