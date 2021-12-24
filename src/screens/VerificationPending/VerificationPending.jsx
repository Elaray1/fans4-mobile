import React, { useCallback, useEffect, useRef } from 'react';
import { AppState, View, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import * as rootNavigation from 'helpers/rootNavigation';

import Header from 'components/Header';
import Text from 'components/Text';

import PendingIllustration from 'assets/illustrations/verification-pending.svg';


import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';
import * as userApi from 'resources/user/user.api';
import { USER_STATUSES } from 'resources/user/user.constants';
import styles from './styles';

function VerificationPending() {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userType = useSelector(userSelectors.getUserType);
  const userEmail = useSelector(userSelectors.getUserEmail);

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
  }, [dispatch]);

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
    <SafeAreaView>
      <Header
        leftItemType="backArrow"
        onLeftItemPress={goToSignIn}
      />
      <View style={styles.container}>
        <PendingIllustration style={styles.illustration} />
        <Text style={styles.title}>{t('VerificationPending.title')}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{t('VerificationPending.whileWeVerify')}</Text>
          <View style={styles.pointsContainer}>
            <View style={styles.pointContainer}>
              <View style={styles.numberContainer}><Text style={styles.number}>1</Text></View>
              <View>
                <Text style={styles.title}>{t('VerificationPending.point1Title')}</Text>
                <Text style={styles.text}>
                  {t('VerificationPending.point1TextPart1')}
                  {userEmail}
                  {t('VerificationPending.point1TextPart2')}
                </Text>
              </View>
            </View>
            <View style={styles.pointContainer}>
              <View style={styles.numberContainer}><Text style={styles.number}>2</Text></View>
              <View>
                <Text style={styles.title}>{t('VerificationPending.point2Title')}</Text>
                <Text style={styles.text}>{t('VerificationPending.point2Text')}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default React.memo(VerificationPending);
