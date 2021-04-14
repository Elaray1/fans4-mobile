import React, { useState } from 'react';
import {
  SafeAreaView, View, StatusBar, Dimensions,
} from 'react-native';
import DatePicker from 'react-native-date-picker';

import colors from 'themes/colors';

import Header from 'components/Header';
import Input from 'components/Input';

import styles from './BiographicalData.styles';

const { width } = Dimensions.get('window');

function BiographicalData() {
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [date, setDate] = useState(new Date('1990-01-01'));

  return (
    <SafeAreaView style={styles.screen}>
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
        <DatePicker
          style={[styles.datepicker, { width: width - 40 }]} // 40 - is the horizontal padding
          date={date}
          maximumDate={new Date()}
          onDateChange={setDate}
          androidVariant="iosClone"
          mode="date"
          textColor={colors.white}
          fadeToColor={colors.main}
          dividerHeight={0}
        />
      </View>
    </SafeAreaView>
  );
}

export default BiographicalData;
