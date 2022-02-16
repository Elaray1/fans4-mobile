import React, { useCallback } from 'react';
import { SafeAreaView, View, StatusBar, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';

import colors from 'themes/colors';

import LogoAsset from 'assets/logo.svg';

import Text from 'components/Text';
import Button from 'components/Button';

import { USER_TYPES } from 'resources/user/user.constants';

import analyticsService from 'services/analytics.service';

import * as wasOpenedBeforeSelectors from 'store/wasOpenedBefore/selectors';

import styles from './SelectUserType.styles';

function SelectUserType() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const wasOpenedBefore = useSelector(wasOpenedBeforeSelectors.getWasOpenedBefore);

  const onChooseUserType = useCallback(async (userType) => {
    if (userType === USER_TYPES.FAN) {
      const nextScreen = !wasOpenedBefore && Platform.OS === 'ios' ? 'SignUp' : 'SignIn';

      navigation.navigate(nextScreen, { userType });
      analyticsService.logEvent({ name: analyticsService.events.IAM_FAN_PRESSED });

      return;
    }

    const nextScreen = wasOpenedBefore ? 'SignIn' : 'SignUp';

    navigation.navigate(nextScreen, { userType });
    analyticsService.logEvent({ name: analyticsService.events.IAM_FIGHTER_PRESSED });
  }, [navigation, wasOpenedBefore]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <LogoAsset style={styles.logo} />
        <Text style={styles.title}>{t('SelectRole.selectYourRole')}</Text>
        <View>
          <Button
            title={t('SelectRole.ImFighter')}
            onPress={() => onChooseUserType(USER_TYPES.FIGHTER)}
            style={styles.fighterButton}
          />
          <Button
            title={t('SelectRole.ImFan')}
            onPress={() => onChooseUserType(USER_TYPES.FAN)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SelectUserType;
