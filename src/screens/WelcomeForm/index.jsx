import React, { useCallback, useState, useMemo, useRef } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import * as userActions from 'resources/user/user.actions';
import * as userApi from 'resources/user/user.api';
import { USER_TYPES, FAN_GENDERS } from 'resources/user/user.constants';

import analyticsService from 'services/analytics.service';
import useToast from 'hooks/useToast';

import Header from 'components/Header';
import Input from 'components/Input';
import Text from 'components/Text';
import Button from 'components/Button';
import DatePickerModal from 'components/DatePickerModal';

import GenderSelectModal from './components/GenderSelectModal';

import styles from './styles';

const WelcomeForm = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { showFailure } = useToast();

  const fullNameInputRef = useRef(null);
  const userNameInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');

  const [birthDate, setBirthDate] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const genders = useMemo(() => [
    { _id: FAN_GENDERS.MALE, label: t('fanGenders.male') },
    { _id: FAN_GENDERS.FEMALE, label: t('fanGenders.female') },
    { _id: FAN_GENDERS.NONBINARY, label: t('fanGenders.nonbinary') },
    { _id: FAN_GENDERS.OTHER, label: t('fanGenders.other') },
    { _id: FAN_GENDERS.PREFER_NOT_TO_SAY, label: t('fanGenders.preferNotToSay') },
  ], [t]);

  const [gender, setGender] = useState(null);
  const [isGenderSelectVisible, setIsGenderSelectVisible] = useState(false);

  const onBirthDatePress = useCallback(() => {
    setIsDatePickerVisible(true);

    fullNameInputRef.current?.blur();
    userNameInputRef.current?.blur();
  }, []);

  const onCloseDatePickerModal = useCallback(() => {
    setIsDatePickerVisible(false);
  }, []);

  const onSubmitDatePickerModal = useCallback((datePickerDate) => {
    setBirthDate(datePickerDate);
    setIsDatePickerVisible(false);
  }, []);

  const onGenderInputPress = useCallback(() => {
    setIsGenderSelectVisible(true);

    fullNameInputRef.current?.blur();
    userNameInputRef.current?.blur();
  }, []);

  const onCloseGenderSelectModal = useCallback(() => {
    setIsGenderSelectVisible(false);
  }, []);

  const onSelectGender = useCallback((newGender) => {
    setGender(newGender);
    setIsGenderSelectVisible(false);
  }, []);

  const onSubmit = useCallback(async () => {
    setIsLoading(true);

    try {
      const user = await userApi.fillWelcomeForm({
        gender: gender._id,
        firstName,
        lastName,
        birthDate,
        userName,
      });

      analyticsService.logEvent({ name: analyticsService.events.REGISTRATION_COMPLETED });
      dispatch(userActions.setUserData(user));

      navigation.navigate('TermsOfUse');
    } catch (err) {
      console.error('Fill welcome form err:', err);
      showFailure();
    }

    setIsLoading(false);
  }, [birthDate, firstName, lastName, userName, gender, showFailure, dispatch, navigation]);

  const goToSelectType = useCallback(async () => {
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
  }, [dispatch, navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={onCloseDatePickerModal}
        onSubmit={onSubmitDatePickerModal}
        {...(birthDate && { date: birthDate })}
      />

      <GenderSelectModal
        visible={isGenderSelectVisible}
        onClose={onCloseGenderSelectModal}
        onSelect={onSelectGender}
        gender={gender}
        genders={genders}
      />

      <Header
        title={t('WelcomeForm.title')}
        leftItemType="backArrow"
        onLeftItemPress={goToSelectType}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Input
            ref={fullNameInputRef}
            label={t('WelcomeForm.firstName')}
            value={firstName}
            onChange={setFirstName}
          />
          <Input
            ref={fullNameInputRef}
            label={t('WelcomeForm.lastName')}
            value={lastName}
            onChange={setLastName}
          />

          <Input
            ref={userNameInputRef}
            label={t('WelcomeForm.userName')}
            maxLength={25}
            value={userName}
            onChange={setUserName}
            style={styles.inputWrapper}
          />

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>{t('WelcomeForm.birthDate')}</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={onBirthDatePress}
              activeOpacity={0.8}
            >
              <Text style={styles.asInput}>{birthDate ? dayjs(birthDate).format('MM/DD/YYYY') : ''}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>{t('WelcomeForm.gender')}</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={onGenderInputPress}
              activeOpacity={0.8}
            >
              <Text style={styles.asInput}>{gender?.label || ''}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title={t('FighterRecord.submit')}
          isLoading={isLoading}
          disabled={!firstName || !lastName || !userName || !gender || !birthDate || isLoading}
          onPress={onSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default WelcomeForm;
