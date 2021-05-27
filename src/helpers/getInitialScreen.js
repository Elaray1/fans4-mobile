import { USER_TYPES, USER_STATUSES } from 'resources/user/user.constants';

export default (user) => {
  if (!user) {
    return {
      stack: 'AuthStack',
      screen: 'SelectUserType',
    };
  }

  if (user.role.type === USER_TYPES.FIGHTER) {
    if (user.status === USER_STATUSES.PENDING) {
      if (!user.appState.isEmailVerified) {
        return {
          stack: 'AppStack',
          screen: 'EmailConfirmation',
        };
      }

      const isProfileDataSubmited = !!user.role.biography;

      if (isProfileDataSubmited) {
        return {
          stack: 'AppStack',
          screen: 'VerificationPending',
        };
      }

      return {
        stack: 'AppStack',
        screen: 'BiographicalData',
      };
    }

    if (user.status === USER_STATUSES.DECLINED) {
      return {
        stack: 'AppStack',
        screen: 'VerificationFailed',
      };
    }

    if (user.status === USER_STATUSES.BLOCKED) {
      return {
        stack: 'AppStack',
        screen: 'AccountBlocked',
      };
    }
  }

  if (user.role.type === USER_TYPES.FAN) {
    return {
      stack: 'AppStack',
      screen: 'Feed',
    };
  }

  if (!user.appState.isOnboardingCompleted) {
    return {
      stack: 'AppStack',
      screen: 'OnBoarding1',
    };
  }

  return {
    stack: 'AppStack',
    screen: 'Account',
  };
};
