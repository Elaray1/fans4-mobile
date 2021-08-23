import React, { useCallback } from 'react';
import {
  SafeAreaView, ScrollView, StatusBar, View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import colors from 'themes/colors';

import Text from 'components/Text';
import Header from 'components/Header';
import Button from 'components/Button';

import { USER_TYPES } from 'resources/user/user.constants';
import * as userSelectors from 'resources/user/user.selectors';

import analyticsService from 'services/analytics.service';

import styles from './TermsOfUse.styles';

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
      routes: [{ name: isFan ? 'OnBoarding1' : 'VerificationPending' }],
    });
  }, [isFan, navigation, userId]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header leftItemType="backArrow" title={t('TermsOfUse.headerTitle')} />
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{t('TermsOfUse.firstParagraphTitle')}</Text>
          <Text style={styles.text}>{t('TermsOfUse.firstParagraphText')}</Text>
          <Text style={styles.title}>{t('TermsOfUse.secondParagraphTitle')}</Text>
          <Text style={styles.text}>{t('TermsOfUse.secondParagraphText')}</Text>
        </ScrollView>
        <Button
          title={t('TermsOfUse.buttonText')}
          onPress={onAccept}
          buttonStyles={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

export default React.memo(TermsOfUse);
