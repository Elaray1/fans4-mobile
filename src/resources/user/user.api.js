import { apiClient } from 'helpers/api';

export const emailSignUp = ({
  email, password, userType, deviceId,
}) => apiClient
  .post('users/signup', {
    email, password, userType, deviceId,
  });

export const sendEmailConfirmation = ({
  email,
}) => apiClient
  .post('users/send-email-confirmation', {
    email,
  });

export const fetchAccessToken = ({ deviceId }) => apiClient
  .get('users/fetch-access-token', { deviceId });

export const getUserData = () => apiClient
  .get('users/current');

export const getUsers = ({ page, perPage, myFollowers }) => apiClient
  .get('users', {
    page,
    perPage,
    ...(myFollowers && { myFollowers }),
  });

export const getUsersCount = ({ myFollowers }) => apiClient
  .get('users/count', {
    ...(myFollowers && { myFollowers }),
  });

export const setPushToken = ({ token, deviceId }) => apiClient
  .put('users/push-token', { token, deviceId });

export const emailSignIn = ({
  email, password, userType, deviceId,
}) => apiClient
  .post('users/signin', {
    email, password, userType, deviceId,
  });

/* Fighters api: start */

// export const fillRegistrationForm = ({
//   fullName, nickname, birthdate, cityId, weight, height, reach,
// }) => apiClient
//   .put('users/registration-form', {
//     fullName, nickname, birthdate, cityId, weight, height, reach,
//   });

export const updateUserInfo = ({
  about,
}) => apiClient
  .put('users/', {
    about,
  });

/* Fighters api: end */

export const completeOnboarding = () => {
  return apiClient.put('users/onboarding');
};

export const logout = ({ deviceId }) => apiClient
  .post('users/logout', { deviceId });

export const forgotPassword = ({ email, deviceId, userType }) => apiClient
  .post('users/forgot-password', { email, deviceId, userType });

export const resetPassword = ({ password }) => apiClient
  .put('users/password/reset', { password });

export const updatePassword = ({ oldPassword, newPassword }) => apiClient
  .put('users/password', { oldPassword, newPassword });

export const updateEmail = ({ newEmail, password }) => apiClient
  .put('users/email', { newEmail, password });
