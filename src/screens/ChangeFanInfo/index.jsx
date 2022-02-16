import React, { useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView, ScrollView, View, TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import _get from 'lodash/get';

import Header from 'components/Header';
import Input from 'components/Input';
import Text from 'components/Text';
import GenderModal from 'components/GenderModal';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';

import { FAN_GENDERS } from 'resources/user/user.constants';
import styles from './styles';

function ChangeFanInfo() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const userFullName = useSelector(userSelectors.getUserFullName);
  const userUserName = useSelector(userSelectors.getUserName);
  const userGender = useSelector(userSelectors.getUserGender);

  const [fullNameValue, setFullName] = useState(userFullName);
  const [usernameValue, setUsername] = useState(userUserName);
  const [genderValue, setGender] = useState(userGender);

  const genderToTag = useMemo(() => ({
    [FAN_GENDERS.MALE]: t('fanGenders.male'),
    [FAN_GENDERS.FEMALE]: t('fanGenders.female'),
    [FAN_GENDERS.NONBINARY]: t('fanGenders.nonbinary'),
    [FAN_GENDERS.OTHER]: t('fanGenders.other'),
    [FAN_GENDERS.PREFER_NOT_TO_SAY]: t('fanGenders.preferNotToSay'),
  }), [t]);

  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);

  const [inputErrors, setInputErrors] = useState({
    fullName: [],
    username: [],
    gender: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const onCloseGenderModal = useCallback(() => {
    setIsGenderModalVisible(false);
  }, []);

  const onSubmitGenderModal = useCallback((value) => {
    setGender(value);
    setIsGenderModalVisible(false);
  }, []);

  const onChangeInputValue = useCallback((inputName) => {
    if (inputErrors[inputName].length) {
      setInputErrors({
        ...inputErrors,
        [inputName]: [],
      });
    }
  }, [inputErrors]);

  const onFullNameChange = useCallback((value) => {
    setFullName(value);
    onChangeInputValue('fullName');
  }, [onChangeInputValue]);

  const onUsernameChange = useCallback((value) => {
    setUsername(value);
    onChangeInputValue('username');
  }, [onChangeInputValue]);

  const onGenderPress = useCallback(() => {
    setIsGenderModalVisible(true);
  }, []);

  const onPressSave = useCallback(async () => {
    const isErrors = false;

    if (inputErrors.username.length) {
      setInputErrors({
        ...inputErrors,
        username: [],
      });
    }

    if (inputErrors.fullName.length) {
      setInputErrors({
        ...inputErrors,
        fullName: [],
      });
    }

    if (inputErrors.gender.length) {
      setInputErrors({
        ...inputErrors,
        gender: [],
      });
    }

    if (!isErrors) {
      setIsLoading(true);

      try {
        await dispatch(userActions.updateUserInfo({
          fullName: fullNameValue,
          userName: usernameValue,
          gender: genderValue,
        }));
        navigation.navigate('AccountInformation');
      } catch (error) {
        const { fullName, userName, gender } = _get(error, 'data.errors', {});
        if (fullName) {
          setInputErrors({
            ...inputErrors,
            fullName: [fullName],
          });
        } else if (userName) {
          setInputErrors({
            ...inputErrors,
            username: [userName],
          });
        } else {
          setInputErrors({
            ...inputErrors,
            gender: [gender || t('ChangeFanInfo.anErrorOccurred')],
          });
        }
        setIsLoading(false);
      }
    }
  }, [inputErrors, dispatch, fullNameValue, usernameValue, genderValue, navigation, t]);

  const isSaveButtonDisabled = isLoading
  || !fullNameValue
  || !usernameValue
  || (fullNameValue === userFullName && usernameValue === userUserName && genderValue === userGender)
  || !!inputErrors.fullName.length
  || !!inputErrors.username.length;

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('ChangeFanInfo.nameUsernameGender')}
        leftItemType="backArrow"
        rightItemType="text"
        rightItemText={t('ChangeFanInfo.save')}
        onRightItemPress={onPressSave}
        rightItemDisabled={isSaveButtonDisabled}
        rightItemStyle={isSaveButtonDisabled ? styles.disabledText : undefined}
      />
      <GenderModal
        visible={isGenderModalVisible}
        onClose={onCloseGenderModal}
        onSubmit={onSubmitGenderModal}
        gender={genderValue}
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.emailInput}>
          <Input
            label={t('ChangeFanInfo.fullName')}
            value={fullNameValue}
            onChange={onFullNameChange}
            errors={inputErrors.fullName}
          />
        </View>
        <View style={styles.emailInput}>
          <Input
            label={t('ChangeFanInfo.username')}
            value={usernameValue}
            onChange={onUsernameChange}
            maxLength={25}
            errors={inputErrors.username}
          />
        </View>
        <View>
          <Text style={styles.inputLabel}>{t('ChangeFanInfo.gender')}</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={onGenderPress}
            activeOpacity={0.8}
          >
            <Text style={styles.input}>{genderToTag[genderValue]}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default React.memo(ChangeFanInfo);
