import { apiClient } from 'helpers/api';

export const signUp = userData => apiClient
  .post('account/signup', userData);

export const signIn = (email, password) => apiClient
  .post('account/signin', { email, password });

export const verifyEmailDev = _signupToken => apiClient
  .get(`account/verifyEmail/${_signupToken}`);

export const signOut = () => apiClient
  .post('account/logout');

export const getUsers = ({ role, status }) => apiClient
  .get(`users?role=${role}&status=${status}`);

export const setPushToken = ({ token, deviceId }) => apiClient
  .put('users/push-token', { token, deviceId });


/* Fighters api: start */

// export const fillRegistrationForm = ({
//   fullName, nickname, birthdate, cityId, weight, height, reach,
// }) => apiClient
//   .put('users/registration-form', {
//     fullName, nickname, birthdate, cityId, weight, height, reach,
//   });

/* Fighters api: end */
