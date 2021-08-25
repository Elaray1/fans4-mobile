import React, { useCallback } from 'react';
import { SafeAreaView, View, StatusBar, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import colors from 'themes/colors';

import LogoAsset from 'assets/logo.svg';

import Text from 'components/Text';
import Button from 'components/Button';

import { USER_TYPES } from 'resources/user/user.constants';

import { STORAGE_KEYS } from 'helpers/constants';
import { getItem } from 'helpers/storage';

import analyticsService from 'services/analytics.service';

import styles from './SelectUserType.styles';

function SelectUserType() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const wasOpenedBefore = getItem(STORAGE_KEYS.WAS_OPENED_BEFORE);

  const onChooseUserType = useCallback((userType) => {
    if (userType === USER_TYPES.FAN) {
      navigation.navigate('SignIn', { userType });
      analyticsService.logEvent({ name: analyticsService.events.IAM_FAN_PRESSED });
      return;
    }

    navigation.navigate(wasOpenedBefore ? 'SignIn' : 'SignUp', { userType });
    analyticsService.logEvent({ name: analyticsService.events.IAM_FIGHTER_PRESSED });
  }, [navigation, wasOpenedBefore]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
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
