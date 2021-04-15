import React, { useState, useCallback } from 'react';
import {
  SafeAreaView, View, StatusBar, TouchableOpacity,
} from 'react-native';
import dayjs from 'dayjs';

import colors from 'themes/colors';

import Header from 'components/Header';
import Input from 'components/Input';
import Text from 'components/Text';
import DatePickerModal from 'components/DatePickerModal';

import styles from './BiographicalData.styles';

function BiographicalData() {
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [date, setDate] = useState(null);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const onBirthDatePress = useCallback(() => {
    setIsDatePickerVisible(!isDatePickerVisible);
  }, [isDatePickerVisible]);

  const onCloseDatePickerModal = useCallback(() => {
    setIsDatePickerVisible(false);
  }, []);

  const onSubmitDatePickerModal = useCallback((datePickerDate) => {
    setDate(datePickerDate);
    setIsDatePickerVisible(false);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={onCloseDatePickerModal}
        onSubmit={onSubmitDatePickerModal}
        {...(date && { date })}
      />
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header isBackArrow title="Biographical Data" />
      <View style={styles.content}>
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
            <Text style={styles.input}>{date ? dayjs(date).format('MM/DD/YYYY') : ''}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

export default BiographicalData;
