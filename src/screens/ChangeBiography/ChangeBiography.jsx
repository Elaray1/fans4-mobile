import React, { useState, useCallback } from 'react';
import {
  SafeAreaView, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Header from 'components/Header';
import Input from 'components/Input';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';

import styles from './ChangeBiography.styles';

function ChangeBiography() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const initialValue = useSelector(userSelectors.getUserBiographyAbout || '');

  const [value, setValue] = useState(initialValue);

  const saveButtonProps = (!value || initialValue === value)
    ? { rightItemStyle: styles.disabledText }
    : {};

  const onPressSave = useCallback(async () => {
    await dispatch(userActions.updateUserInfo({ about: value }));
    navigation.goBack();
  }, [dispatch, value, navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={initialValue ? t('ChangeBiography.changeBiography') : t('ChangeBiography.addBiography')}
        leftItemType="backArrow"
        rightItemType="text"
        rightItemText={t('ChangeBiography.save')}
        onRightItemPress={onPressSave}
        {...saveButtonProps}
      />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Input
          label={t('ChangeBiography.biography')}
          value={value}
          onChange={setValue}
          maxLength={300}
          style={styles.input}
          multiline
          numberOfLines={20}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default ChangeBiography;
