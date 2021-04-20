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

export const getUsers = ({ role, status }) => apiClient
  .get(`users?role=${role}&status=${status}`);

export const setPushToken = ({ token, deviceId }) => apiClient
  .put('users/push-token', { token, deviceId });

export const emailSignIn = ({
  email, password, userType, deviceId,
}) => apiClient
  .post('users/signin', {
    email, password, userType, deviceId,
  });

export const updatePassword = ({ oldPassword, newPassword }) => apiClient
  .put('users/password', { oldPassword, newPassword });


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

export const forgotPassword = ({ email, deviceId }) => apiClient
  .post('users/forgot-password', { email, deviceId });

export const resetPassword = ({ password }) => apiClient
  .put('users/password-setup', { password });
