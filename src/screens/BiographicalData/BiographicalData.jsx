import React, { useState, useCallback } from 'react';
import {
  SafeAreaView, View, ScrollView, StatusBar, TouchableOpacity,
} from 'react-native';
import dayjs from 'dayjs';

import colors from 'themes/colors';

import Header from 'components/Header';
import Input from 'components/Input';
import Text from 'components/Text';
import Button from 'components/Button';
import DatePickerModal from 'components/DatePickerModal';
import CitySelectModal from 'components/CitySelectModal';
import Toggle from 'components/Toggle';

import styles from './BiographicalData.styles';

const GENDERS = {
  male: 'male',
  female: 'female',
};

function BiographicalData() {
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [hometown, setHometown] = useState({ cityNameWithState: null, cityId: null });

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isCitySelectVisible, setIsCitySelectVisible] = useState(false);
  const [gender, setGender] = useState(GENDERS.male);

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

  return (
    <SafeAreaView style={styles.screen}>
      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={onCloseDatePickerModal}
        onSubmit={onSubmitDatePickerModal}
        {...(birthDate && { date: birthDate })}
      />
      <CitySelectModal
        visible={isCitySelectVisible}
        onClose={onCloseCitySelectModal}
        onSubmit={onSubmitCitySelectModal}
        {...(hometown?.cityId && { cityId: hometown.cityId })}
      />
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Header isBackArrow title="Biographical Data" />
        <View>
          <Input
            label="First and last name"
            value={fullName}
            onChange={setFullName}
          />

          <Input
            label="Nickname - optional"
            value={nickname}
            onChange={setNickname}
          />

          <View>
            <Text style={styles.inputLabel}>Birth Date</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={onBirthDatePress}
              activeOpacity={0.8}
            >
              <Text style={styles.input}>{birthDate ? dayjs(birthDate).format('MM/DD/YYYY') : ''}</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.inputLabel}>Hometown</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={onHometownPress}
              activeOpacity={0.8}
            >
              <Text style={styles.input}>{hometown?.cityNameWithState || ''}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text style={styles.inputLabel}>Gender by Birth</Text>
          <Toggle
            leftOption={{ id: GENDERS.male, value: GENDERS.male }}
            rightOption={{ id: GENDERS.female, value: GENDERS.female }}
            selectedOptionId={gender}
            onSelect={setGender}
          />
        </View>

        <Button
          title="Next"
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default BiographicalData;
