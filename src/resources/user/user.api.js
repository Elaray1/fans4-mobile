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

export const removeVerificationDeviceId = deviceId => apiClient
  .put('users/remove-verification-device-id', { deviceId });

export const getUsers = ({ role, status }) => apiClient
  .get(`users?role=${role}&status=${status}`);

export const setPushToken = ({ token, deviceId }) => apiClient
  .put('users/push-token', { token, deviceId });

<<<<<<< HEAD

/* Fighters api: start */

// export const fillRegistrationForm = ({
//   fullName, nickname, birthdate, cityId, weight, height, reach,
// }) => apiClient
//   .put('users/registration-form', {
//     fullName, nickname, birthdate, cityId, weight, height, reach,
//   });

/* Fighters api: end */
=======
export const emailSignIn = ({
  email, password, userType, deviceId,
}) => apiClient
  .post('users/signin', {
    email, password, userType, deviceId,
  });
>>>>>>> Add sign up, sign in, email confirmation, fetch access token, get user data, remove verification id to user actions,
