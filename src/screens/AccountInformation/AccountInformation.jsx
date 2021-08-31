import React, { useCallback, useState, useEffect } from 'react';
import {
  SafeAreaView, ScrollView, View, TouchableOpacity, AppState,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import ArrowRightIcon from 'assets/icons/arrow-right';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';
import { USER_TYPES } from 'resources/user/user.constants';

import useToast from 'hooks/useToast';

import Header from 'components/Header';
import Text from 'components/Text';
import DatePickerModal from 'components/DatePickerModal';

import styles from './AccountInformation.styles';

function AccountInformation() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const dispatch = useDispatch();

  const userEmail = useSelector(userSelectors.getUserEmail);
  const userNewEmail = useSelector(userSelectors.getUserNewEmail);
  const userType = useSelector(userSelectors.getUserType);
  const birthdate = useSelector(userSelectors.getUserBirthdate);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeBiography = useCallback(() => {
    navigation.navigate('ChangeBiography');
  }, [navigation]);

  const onChangeFanInfo = useCallback(() => {
    navigation.navigate('ChangeFanInfo');
  }, [navigation]);

  const onChangeEmail = useCallback(() => {
    navigation.navigate('ChangeEmail');
  }, [navigation]);

  const onBirthDatePress = useCallback(() => {
    setIsDatePickerVisible(true);
  }, []);

  const onCloseDatePickerModal = useCallback(() => {
    setIsDatePickerVisible(false);
  }, []);

  const onBackArrowPress = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{
        name: 'AppStack',
        state: {
          routes: [{ name: 'Account' }],
        },
      }],
    });
  }, [navigation]);

  const onSubmitDatePickerModal = useCallback(async (datePickerDate) => {
    setIsLoading(true);
    try {
      await dispatch(userActions.updateUserInfo({
        birthdate: dayjs(datePickerDate).format('MM/DD/YYYY'),
      }));
    } catch (err) {
      showFailure(t('AccountInformation.couldntUpdateBirthdate'));
    } finally {
      setIsLoading(false);
    }
    setIsDatePickerVisible(false);
  }, [dispatch, showFailure, t]);

  const checkIfNewEmailConfirmed = useCallback(() => {
    try {
      dispatch(userActions.getUserData());
    } catch (error) {
      showFailure();
    }
  }, [dispatch, showFailure]);

  useEffect(() => {
    const checkAccountOnFocus = async (appState) => {
      if (isFocused && appState === 'active') {
        await checkIfNewEmailConfirmed();
      }
    };

    AppState.addEventListener('change', checkAccountOnFocus);

    return () => {
      AppState.removeEventListener('change', checkAccountOnFocus);
    };
  }, [isFocused, navigation, checkIfNewEmailConfirmed]);


  return (
    <SafeAreaView style={styles.screen}>
      <DatePickerModal
        isLoading={isLoading}
        visible={isDatePickerVisible}
        onClose={onCloseDatePickerModal}
        onSubmit={onSubmitDatePickerModal}
        {...(birthdate && { date: birthdate })}
      />
      <Header
        title={t('AccountInformation.accountInformation')}
        leftItemType="backArrow"
        onLeftItemPress={onBackArrowPress}
      />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {userType === USER_TYPES.FIGHTER && (
          <>
            <View>
              <TouchableOpacity
                style={styles.item}
                onPress={onChangeEmail}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemText}>{t('AccountInformation.email')}</Text>
                  <View style={styles.itemContent}>
                    <View style={styles.itemContent}>
                      <Text style={[styles.email, userNewEmail && styles.newEmail]}>
                        {userNewEmail ?? userEmail}
                      </Text>
                      {userNewEmail && (
                      <View style={styles.emailPending}>
                        <Text style={styles.emailPendingText}>{t('AccountInformation.pending')}</Text>
                      </View>
                      )}
                    </View>
                    <ArrowRightIcon style={styles.arrowRight} />
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.line} />
            </View>
            <View>
              <TouchableOpacity
                style={styles.item}
                onPress={onChangeBiography}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemText}>{t('AccountInformation.biography')}</Text>
                  <ArrowRightIcon />
                </View>
              </TouchableOpacity>
              <View style={styles.line} />
            </View>
          </>
        )}

        {userType === USER_TYPES.FAN && (
          <>
            <View>
              <TouchableOpacity
                style={styles.item}
                onPress={onChangeFanInfo}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemText}>{t('AccountInformation.nameUsernameGender')}</Text>
                  <ArrowRightIcon />
                </View>
              </TouchableOpacity>
              <View style={styles.line} />
            </View>
            <View>
              <TouchableOpacity
                style={styles.item}
                onPress={onChangeEmail}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemText}>{t('AccountInformation.email')}</Text>
                  <View style={styles.itemContent}>
                    <View style={styles.itemContent}>
                      <Text style={[styles.email, userNewEmail && styles.newEmail]}>
                        {userNewEmail ?? userEmail}
                      </Text>
                      {userNewEmail && (
                      <View style={styles.emailPending}>
                        <Text style={styles.emailPendingText}>Pending</Text>
                      </View>
                      )}
                    </View>
                    <ArrowRightIcon style={styles.arrowRight} />
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.line} />
            </View>
            <View>
              <TouchableOpacity
                style={styles.item}
                onPress={onBirthDatePress}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemText}>{t('AccountInformation.birthDate')}</Text>
                  <View style={styles.itemContent}>
                    <View style={styles.itemContent}>
                      <Text style={styles.email}>
                        {dayjs(birthdate).format('MM/DD/YYYY')}
                      </Text>
                    </View>
                    <View style={styles.arrowSpace} />
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.line} />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default AccountInformation;
