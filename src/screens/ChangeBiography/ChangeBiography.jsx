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
import * as userApi from 'resources/user/user.api';

import analyticsService from 'services/analytics.service';

import useToast from 'hooks/useToast';

import styles from './ChangeBiography.styles';

function ChangeBiography() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { showFailure, showSuccess } = useToast();

  const initialValue = useSelector(userSelectors.getUserBiographyAbout);
  const userId = useSelector(userSelectors.getUserId);

  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const isSaveButtonDisabled = isLoading || !value || initialValue === value;

  const saveButtonProps = isSaveButtonDisabled
    ? { rightItemStyle: styles.disabledText }
    : {};

  const onPressSave = useCallback(async () => {
    setIsLoading(true);

    try {
      const user = await userApi.updateUserInfo({ about: value });
      showSuccess(t('ChangeBiography.updated'));
      dispatch(userActions.setUserData(user));
    } catch (err) {
      console.error('Updating biography error:', err);
      showFailure();
    }

    setIsLoading(false);

    analyticsService.logEvent({
      name: analyticsService.events.FIGHTER_BIOGRAPHY_ADDED,
      data: {
        userId,
      },
    });

    navigation.goBack();
  }, [dispatch, value, navigation, userId, showSuccess, showFailure, t]);

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={initialValue ? t('ChangeBiography.changeBiography') : t('ChangeBiography.addBiography')}
        leftItemType="backArrow"
        rightItemType="text"
        rightItemText={t('ChangeBiography.save')}
        onRightItemPress={onPressSave}
        rightItemDisabled={isSaveButtonDisabled}
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

export default React.memo(ChangeBiography);
