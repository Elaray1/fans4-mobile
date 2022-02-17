import dayjs from 'dayjs';
import { createSelector } from 'reselect';

import { FANS4_ACCOUNT } from 'helpers/constants';
import isSubscribedService from 'services/isSubscribed.service';

export const getAuthenticated = ({ user }) => user !== null;

export const getUserData = ({ user }) => user;

export const getUserId = ({ user }) => user?._id;
export const getUserEmail = ({ user }) => user?.email;
export const getUserType = ({ user }) => user?.role?.type;
export const getUserFullName = ({ user }) => user?.fullName;
export const getUserNewEmail = ({ user }) => user?.appState?.newEmail;
export const getUserStatus = ({ user }) => user?.status;
export const getVotingCardsIndicator = ({ user }) => user?.appState.isUnreadVotingCards;

/* Fighters selectors: start */

export const getUserNickname = ({ user }) => user?.role?.biography?.nickname;
export const getFightingStatus = ({ user }) => user?.role?.fightingStatus;
export const getHometown = ({ user }) => {
  if (user?.role?.biography?.hometown) {
    const { cityName, stateCode } = user?.role?.biography?.hometown;
    return `${cityName}, ${stateCode}`;
  }
};

export const getAvatarUrl = ({ user }) => user?.avatarUrl;
export const getUserAge = ({ user }) => dayjs().diff(user?.role?.biography?.birthdate, 'year');
export const getUserProfileInfo = ({ user }) => user?.role?.profile;
export const getUserBiographyAbout = ({ user }) => user?.role?.biography?.about || '';
export const getUserIntroVideo = ({ user }) => user?.role?.biography?.introVideo;
export const getUserProcessingIntroVideo = ({ user }) => user?.role?.biography?.processingIntroVideo;
export const getWeightClasses = ({ user }) => user?.role?.profile?.weightClasses;
export const getUserBirthdate = ({ user }) => new Date(user?.role?.biography?.birthdate);
export const getUserGender = ({ user }) => user?.role?.biography?.gender;
export const getUserFighterType = ({ user }) => user?.role?.fighterType;
export const getIsBankAccountWarning = ({ user }) => user?.appState?.isBankAccountWarning;


/* Fighters selectors: end */

/* Fans selectors: start */

export const getAllSupportedFighters = ({ user }) => user?.role?.subscription?.fighters;
export const getSupportedFighters = createSelector(
  getAllSupportedFighters,
  fighters => fighters
    && fighters.filter(fighter => fighter._id !== FANS4_ACCOUNT._id
    && isSubscribedService.isSubscribed({ subscriptionToFighter: fighter })),
);

export const getUserName = ({ user }) => user?.role?.biography?.userName;

export const getIsPaidSubscription = createSelector(getSupportedFighters, fighters => fighters?.length > 0);

/* Fans selectors: end */
