import React, { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import * as rootNavigation from 'helpers/rootNavigation';

import IllustrationScreen from 'components/IllustrationScreen';

import PendingIllustration from 'assets/illustrations/verification-pending.svg';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';
import * as userApi from 'resources/user/user.api';
import { USER_STATUSES } from 'resources/user/user.constants';

function VerificationPending() {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userType = useSelector(userSelectors.getUserType);

  const checkVerificationIntervalTimerRef = useRef();

  const checkVerification = useCallback(async () => {
    let updatedUser;

    try {
      updatedUser = await userApi.getUserData();
      dispatch(userActions.setUserData(updatedUser));
    } catch (err) {
      console.error('updating user error:', err);
    }

    if (!updatedUser) {
      return;
    }

    if (updatedUser.status === USER_STATUSES.VERIFIED) {
      rootNavigation.resetToScreen('AppStack', 'VerificationSuccessful');
    } else if (updatedUser.status === USER_STATUSES.DECLINED) {
      rootNavigation.resetToScreen('AppStack', 'VerificationFailed');
    } else if (updatedUser.status === USER_STATUSES.BLOCKED) {
      rootNavigation.resetToScreen('AppStack', 'AccountBlocked');
    } else {
      return;
    }

    if (checkVerificationIntervalTimerRef.current) {
      clearInterval(checkVerificationIntervalTimerRef.current);
    }
  }, []);

  useEffect(() => {
    checkVerificationIntervalTimerRef.current = setInterval(checkVerification, 3000);
    return () => checkVerificationIntervalTimerRef.current && clearInterval(checkVerificationIntervalTimerRef.current); // eslint-disable-line max-len
  }, [checkVerification]);

  useEffect(() => {
    const checkVerificationOnPending = async (appState) => {
      if (isFocused && appState === 'active') {
        await checkVerification();
      }
    };

    AppState.addEventListener('change', checkVerificationOnPending);

    return () => {
      AppState.removeEventListener('change', checkVerificationOnPending);
    };
  }, [isFocused, navigation, checkVerification]);

  const goToSignIn = useCallback(async () => {
    navigation.reset({
      index: 1,
      routes: [{
        name: 'AuthStack',
        state: {
          routes: [{
            name: 'SelectUserType',
          }],
        },
      }, {
        name: 'AuthStack',
        state: {
          routes: [{
            name: 'SignIn',
            params: {
              userType,
            },
          }],
        },
      }],
    });

    await dispatch(userActions.logout());
  }, [navigation, dispatch, userType]);

  return (
    <IllustrationScreen
      linkText={t('VerificationPending.linkText')}
      description={t('VerificationPending.description')}
      title={t('VerificationPending.title')}
      illustration={<PendingIllustration />}
      onLinkPress={goToSignIn}
    />
  );
}

export default React.memo(VerificationPending);
