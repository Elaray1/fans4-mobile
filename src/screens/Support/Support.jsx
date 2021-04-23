import React, { useCallback } from 'react';
import {
  SafeAreaView, View, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import colors from 'themes/colors';

import Header from 'components/Header';
import Button from 'components/Button';
import Question from 'components/Question';

import styles from './Support.styles';

function Support() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const items = [
    {
      _id: '1',
      title: t('Support.question1'),
      text: t('Support.answer1'),
    },
    {
      _id: '2',
      title: t('Support.question2'),
      text: t('Support.answer2'),
    },
    {
      _id: '3',
      title: t('Support.question3'),
      text: t('Support.answer3'),
    },
    {
      _id: '4',
      title: t('Support.question4'),
      text: t('Support.answer4'),
    },
    {
      _id: '5',
      title: t('Support.question5'),
      text: t('Support.answer5'),
    },
  ];


  const onButtonPress = useCallback(() => {
    navigation.navigate('ContactAdmin');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header leftItemType="backArrow" title={t('Support.support')} />
      <View style={styles.content}>
        <View>
          {items.map(
            item => (
              <Question title={item.title} text={item.text} key={item._id} />
            ),
          )}
        </View>
        <Button title={t('Support.contactAdmin')} onPress={onButtonPress} />
      </View>
    </SafeAreaView>
  );
}

export default React.memo(Support);
