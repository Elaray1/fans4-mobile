import React, { useCallback } from 'react';
import { SafeAreaView, ActivityIndicator, StatusBar, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { WebView } from 'react-native-webview';

import colors from 'themes/colors';

import Header from 'components/Header';
import Button from 'components/Button';

import { USER_TYPES } from 'resources/user/user.constants';
import * as userSelectors from 'resources/user/user.selectors';

import analyticsService from 'services/analytics.service';

import styles from './TermsOfUse.styles';

const TERMS_OF_USE_URL_SOURCE = { uri: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/' };

function TermsOfUse() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const userType = useSelector(userSelectors.getUserType);
  const userId = useSelector(userSelectors.getUserId);

  const isFan = userType === USER_TYPES.FAN;

  const onAccept = useCallback(() => {
    if (!isFan) {
      analyticsService.logEvent({
        name: analyticsService.events.FIGHTER_TOS_ACCEPTED,
        data: {
          userId,
        },
      });
    }

    navigation.reset({
      index: 0,
      routes: [{ name: isFan ? 'OnBoarding' : 'VerificationPending' }],
    });
  }, [isFan, navigation, userId]);


  const renderLoading = () => (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" />
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <Header leftItemType="backArrow" title={t('TermsOfUse.headerTitle')} />

      <View style={styles.content}>
        <WebView
          source={TERMS_OF_USE_URL_SOURCE}
          startInLoadingState
          renderLoading={renderLoading}
        />

        <Button
          title={t('TermsOfUse.buttonText')}
          onPress={onAccept}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

export default React.memo(TermsOfUse);
