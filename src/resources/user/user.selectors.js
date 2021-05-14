import dayjs from 'dayjs';

export const getAuthenticated = ({ user }) => user !== null;

export const getUserData = ({ user }) => user;

export const getUserId = ({ user }) => user?._id;
export const getUserEmail = ({ user }) => user?.email;
export const getUserType = ({ user }) => user?.role?.type;
export const getUserFullName = ({ user }) => user?.fullName;
export const getUserNewEmail = ({ user }) => user?.appState?.newEmail;

/* Fighters selectors: start */

export const getUserNickname = ({ user }) => user?.role?.biography?.nickname;
export const getFightingStatus = ({ user }) => user?.role?.fightingStatus;
export const getHometown = ({ user }) => `${user?.role?.biography.hometown.cityName}, ${user?.role?.biography.hometown.stateCode}`;
export const getAvatarUrl = ({ user }) => user?.avatarUrl;
export const getUserAge = ({ user }) => dayjs().diff(user?.role?.biography?.birthdate, 'year');
export const getUserProfileInfo = ({ user }) => user?.role?.profile;
export const getUserBiographyAbout = ({ user }) => user?.role?.biography?.about || '';

/* Fighters selectors: end */
