import React, { useCallback, useEffect } from 'react';
import { SafeAreaView, View, StatusBar, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import * as userSelectors from 'resources/user/user.selectors';
import { USER_TYPES } from 'resources/user/user.constants';

import analyticsService from 'services/analytics.service';

import colors from 'themes/colors';

import Header from 'components/Header';
import Button from 'components/Button';
import Question from 'components/Question';

import styles from './Support.styles';

function Support() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const userType = useSelector(userSelectors.getUserType);

  useEffect(() => {
    if (userType === USER_TYPES.FIGHTER) {
      analyticsService.logEvent({
        name: analyticsService.events.FIGHTER_OPENED_SUPPORT_SCREEN,
      });
    } else {
      analyticsService.logEvent({
        name: analyticsService.events.FAN_OPENED_SUPPORT_SCREEN,
      });
    }
  }, [userType]);

  const questionsAnswers = t(`Support.${userType}`, { returnObjects: true });
  const optionsLength = Object.keys(questionsAnswers).length / 2;

  const options = (new Array(optionsLength).fill(0)).reduce((acc, cur, index) => {
    const question = questionsAnswers[`question${index + 1}`];
    const answer = questionsAnswers[`answer${index + 1}`];

    acc = acc.concat({
      question,
      answer,
    });

    return acc;
  }, []);

  const items = options.map((option, index) => ({
    _id: index + 1,
    title: option.question,
    text: option.answer,
  }));

  const onButtonPress = useCallback(() => {
    navigation.navigate('ContactAdmin');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />

      <Header leftItemType="backArrow" title={t('Support.support')} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          {items.map(item => <Question title={item.title} text={item.text} key={item._id} />)}
        </View>
        <Button title={t('Support.contactAdmin')} onPress={onButtonPress} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default React.memo(Support);
