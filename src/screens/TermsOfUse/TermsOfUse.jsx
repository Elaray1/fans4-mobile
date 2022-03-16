import React, { useCallback } from 'react';
import { SafeAreaView, ActivityIndicator, StatusBar, View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { WebView } from 'react-native-webview';

import colors from 'themes/colors';

import Button from 'components/Button';
import Text from 'components/Text';

import ErrorIcon from 'assets/icons/error.svg';

import { USER_TYPES, USER_STATUSES } from 'resources/user/user.constants';
import * as userSelectors from 'resources/user/user.selectors';
import * as userActions from 'resources/user/user.actions';

import * as userApi from 'resources/user/user.api';

import analyticsService from 'services/analytics.service';

import useToast from 'hooks/useToast';

import styles from './TermsOfUse.styles';

const TERMS_OF_USE_URL_SOURCE = { uri: 'https://www.fans4.com/terms-of-use-text-only' };

function TermsOfUse() {
  const { showFailure } = useToast();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const userType = useSelector(userSelectors.getUserType);
  const isOnboardingCompleted = useSelector(userSelectors.getIsOnboardingCompleted);
  const userStatus = useSelector(userSelectors.getUserStatus);

  const isFan = userType === USER_TYPES.FAN;

  const onAccept = useCallback(async () => {
    try {
      await userApi.acceptTermsOfUse();
    } catch (error) {
      showFailure();
    }

    if (!isFan) {
      analyticsService.logEvent({
        name: analyticsService.events.FIGHTER_TOS_ACCEPTED,
      });
    }

    let nextScreen;

    if (isFan) {
      if (isOnboardingCompleted) {
        nextScreen = 'Feed';
      } else {
        nextScreen = 'OnBoarding';
      }
    } else if (userStatus === USER_STATUSES.PENDING) {
      nextScreen = 'VerificationPending';
    } else if (!isOnboardingCompleted) {
      nextScreen = 'OnBoarding';
    } else {
      nextScreen = 'Account';
    }

    navigation.reset({
      index: 0,
      routes: [{ name: nextScreen }],
    });
  }, [isFan, navigation, showFailure, isOnboardingCompleted, userStatus]);

  const goToSelectType = useCallback(async () => {
    const logOutAndNavigate = async () => {
      await dispatch(userActions.logout());

      navigation.reset({
        index: 1, // to simulate situation like user went from 'SelectUserType' screen
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
              params: { userType: USER_TYPES.FAN },
            }],
          },
        }],
      });
    };

    Alert.alert(t('logOutAlert.logOut'), t('logOutAlert.doYouWantToLogOutOfTheAccount'), [
      { text: t('logOutAlert.cancel') },
      { text: t('logOutAlert.yes'), onPress: logOutAndNavigate },
    ]);
  }, [dispatch, navigation, t]);

  const renderLoading = () => (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" />
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <View style={styles.content}>
        {isOnboardingCompleted && (
          <View style={styles.updatedTermsWarningContainer}>
            <ErrorIcon />
            <Text style={styles.updatedTermsWarning}>{t('TermsOfUse.updatedTermsWarning')}</Text>
          </View>
        )}

        <WebView
          style={styles.webview}
          source={TERMS_OF_USE_URL_SOURCE}
          startInLoadingState
          renderLoading={renderLoading}
        />

        <Button
          title={t('TermsOfUse.buttonText')}
          onPress={onAccept}
          style={styles.button}
        />

        <Button
          type="link"
          title={t('TermsOfUse.logout')}
          onPress={goToSelectType}
          style={styles.logoutButton}
        />
      </View>
    </SafeAreaView>
  );
}

export default React.memo(TermsOfUse);
