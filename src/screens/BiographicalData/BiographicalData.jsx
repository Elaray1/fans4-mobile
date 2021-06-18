import React, { useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView, View, ScrollView, StatusBar, TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import colors from 'themes/colors';

import Header from 'components/Header';
import Input from 'components/Input';
import Text from 'components/Text';
import Button from 'components/Button';
import DatePickerModal from 'components/DatePickerModal';
import CitySelectModal from 'components/CitySelectModal';
import Toggle from 'components/Toggle';
import UploadMediaButton from 'components/UploadMediaButton';

import * as userActions from 'resources/user/user.actions';
import { FIGHTER_GENDERS } from 'resources/user/user.constants';

import styles from './BiographicalData.styles';

function BiographicalData() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const genders = useMemo(() => [
    { id: FIGHTER_GENDERS.MALE, value: t('BiographicalData.male') },
    { id: FIGHTER_GENDERS.FEMALE, value: t('BiographicalData.female') },
  ], [t]);

  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthdate, setBirthDate] = useState(null);
  const [hometown, setHometown] = useState({ cityNameWithState: null, cityId: null });

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isCitySelectVisible, setIsCitySelectVisible] = useState(false);
  const [gender, setGender] = useState(FIGHTER_GENDERS.MALE);
  const [photo, setPhoto] = useState(null);

  const onBirthDatePress = useCallback(() => {
    setIsDatePickerVisible(true);
  }, []);

  const onCloseDatePickerModal = useCallback(() => {
    setIsDatePickerVisible(false);
  }, []);

  const onSubmitDatePickerModal = useCallback((datePickerDate) => {
    setBirthDate(datePickerDate);
    setIsDatePickerVisible(false);
  }, []);

  const onHometownPress = useCallback(() => {
    setIsCitySelectVisible(true);
  }, []);

  const onCloseCitySelectModal = useCallback(() => {
    setIsCitySelectVisible(false);
  }, []);

  const onSubmitCitySelectModal = useCallback(({ cityNameWithState, cityId }) => {
    setHometown({ cityNameWithState, cityId });
    setIsCitySelectVisible(false);
  }, []);

  const onNext = useCallback(() => {
    navigation.navigate('PersonalInfo', {
      fullName,
      nickname,
      birthdate: dayjs(birthdate).format('MM/DD/YYYY'),
      cityId: hometown?.cityId,
      gender,
      photo: {
        path: photo?.path,
        mime: photo?.mime,
      },
    });
  }, [
    birthdate, fullName, gender, hometown?.cityId, navigation, nickname, photo?.mime, photo?.path,
  ]);

  const goToSelectType = useCallback(async () => {
    await dispatch(userActions.logout());
    navigation.reset({ routes: [{ name: 'AuthStack', params: { screen: 'SelectUserType' } }] });
  }, [dispatch, navigation]);

  const onToggleSelect = useCallback((item) => {
    setGender(item.id);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={onCloseDatePickerModal}
        onSubmit={onSubmitDatePickerModal}
        {...(birthdate && { date: birthdate })}
      />
      <CitySelectModal
        visible={isCitySelectVisible}
        onClose={onCloseCitySelectModal}
        onSubmit={onSubmitCitySelectModal}
        {...(hometown?.cityId && { cityId: hometown.cityId })}
      />
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header
        title={t('BiographicalData.BiographicalData')}
        leftItemType="backArrow"
        onLeftItemPress={goToSelectType}
      />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View>
          <Input
            label={t('BiographicalData.firstAndLastName')}
            value={fullName}
            onChange={setFullName}
          />

          <Input
            label={t('BiographicalData.nicknameOptional')}
            maxLength={25}
            value={nickname}
            onChange={setNickname}
          />

          <View>
            <Text style={styles.inputLabel}>{t('BiographicalData.birthdate')}</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={onBirthDatePress}
              activeOpacity={0.8}
            >
              <Text style={styles.input}>{birthdate ? dayjs(birthdate).format('MM/DD/YYYY') : ''}</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.inputLabel}>{t('BiographicalData.hometown')}</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={onHometownPress}
              activeOpacity={0.8}
            >
              <Text style={styles.input}>{hometown?.cityNameWithState || ''}</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.inputLabel}>{t('BiographicalData.genderByBirth')}</Text>
            <Toggle
              items={genders}
              selectedItemId={gender}
              onSelect={onToggleSelect}
            />
          </View>


          <UploadMediaButton
            label={t('BiographicalData.profilePhoto')}
            handleMediaUpload={setPhoto}
            mediaType="image"
            croppingAvatar
          />
        </View>

        <Button
          title={t('BiographicalData.next')}
          disabled={!fullName || !birthdate || !hometown?.cityNameWithState || !photo?.path}
          onPress={onNext}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default BiographicalData;
