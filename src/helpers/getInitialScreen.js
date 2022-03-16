import { USER_TYPES, USER_STATUSES } from 'resources/user/user.constants';

export default (user) => {
  if (!user) {
    return {
      stack: 'AuthStack',
      screen: 'SelectUserType',
    };
  }

  if (user.status === USER_STATUSES.BLOCKED) {
    return {
      stack: 'AppStack',
      screen: 'AccountBlocked',
    };
  }

  if (user.role.type === USER_TYPES.FIGHTER) {
    if (user.status === USER_STATUSES.IN_REGISTRATION_PROCESS) {
      if (!user.appState.isEmailVerified) {
        return {
          stack: 'AppStack',
          screen: 'EmailConfirmation',
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

    if (!user.appState.isTermsOfUseAccepted) {
      return {
        stack: 'AppStack',
        screen: 'TermsOfUse',
      };
    }

    if (user.status === USER_STATUSES.PENDING) {
      return {
        stack: 'AppStack',
        screen: 'VerificationPending',
      };
    }

    if (!user.appState.isOnboardingCompleted) {
      return {
        stack: 'AppStack',
        screen: 'OnBoarding',
      };
    }

    return {
      stack: 'AppStack',
      screen: 'Account',
    };
  }

  if (user.role.type === USER_TYPES.FAN) {
    if (user.status === USER_STATUSES.IN_REGISTRATION_PROCESS) {
      if (!user.appState.isEmailVerified) {
        return {
          stack: 'AppStack',
          screen: 'EmailConfirmation',
        };
      }

      return {
        stack: 'AppStack',
        screen: 'WelcomeForm',
      };
    }

    if (user.status === USER_STATUSES.VERIFIED) {
      if (!user.appState.isTermsOfUseAccepted) {
        return {
          stack: 'AppStack',
          screen: 'TermsOfUse',
        };
      }

      if (!user.appState.isOnboardingCompleted) {
        return {
          stack: 'AppStack',
          screen: 'OnBoarding',
        };
      }

      return {
        stack: 'AppStack',
        screen: 'Feed',
      };
    }
  }
};
