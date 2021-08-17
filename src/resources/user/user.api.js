import { apiClient } from 'helpers/api';

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

export const getMyFans = ({ page, perPage }) => apiClient.get('users/my-fans', {
  page,
  perPage,
});

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
  wins,
  losses,
  draws,
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
    wins,
    losses,
    draws,
    weightClasses,
  }, avatar);
};

export const updateUserInfo = ({
  about, birthdate, fullName, userName, gender,
}) => apiClient
  .put('users', {
    ...(about && { about }),
    ...(birthdate && { birthdate }),
    ...(fullName && { fullName }),
    ...(userName && { userName }),
    ...(gender && { gender }),
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

export const updateIsBankAccountModal = () => apiClient
  .put('users/bank-account-modal');

export const suggestFight = ({ firstFighterId, secondFighterId }) => apiClient
  .post('fights/suggest', { firstFighterId, secondFighterId });

export const getPasswordResetToken = ({ deviceId }) => apiClient
  .get('users/password-reset-token-checking', { deviceId });
