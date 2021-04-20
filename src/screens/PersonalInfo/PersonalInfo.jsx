import React, { useMemo, useState, useCallback } from 'react';
import {
  SafeAreaView, View, ScrollView, StatusBar, TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import colors from 'themes/colors';

import Text from 'components/Text';
import Header from 'components/Header';
import Button from 'components/Button';
import WheelModal from 'components/WheelModal';


import styles from './PersonalInfo.styles';

const FOOTS = [4, 5, 6, 7];
const INCHES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const footsToString = (foot, inch) => `${foot}’ ${inch}”`;

function PersonalInfo() {
  const { t } = useTranslation();
  const [weight, setWeight] = useState(null);
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);

  const [height, setHeight] = useState(null);
  const [isHeightModalVisible, setIsHeightModalVisible] = useState(false);

  const [reach, setReach] = useState(null);
  const [isReachModalVisible, setIsReachModalVisible] = useState(false);

  const heightOptions = useMemo(() => FOOTS.reduce((acc, foot) => {
    const footInches = INCHES.map(inch => footsToString(foot, inch));
    return [...acc, ...footInches];
  }, []), []);

  const weightOptions = useMemo(() => {
    // 200 - length of options; 100 - value of first option
    const POUNDS = (new Array(200).fill(100))
      .map((x, i) => `${x + i} lbs`);

    return POUNDS;
  }, []);

  const onCloseWeightModal = useCallback(() => {
    setIsWeightModalVisible(false);
  }, []);

  const onSubmitWeightModal = useCallback((pickerWeight) => {
    setWeight(pickerWeight);
    setIsWeightModalVisible(false);
  }, []);

  const onWeightPress = useCallback(() => {
    setIsWeightModalVisible(true);
  }, []);

  const onCloseHeightModal = useCallback(() => {
    setIsHeightModalVisible(false);
  }, []);

  const onSubmitHeightModal = useCallback((pickerHeight) => {
    setHeight(pickerHeight);
    setIsHeightModalVisible(false);
  }, []);

  const onHeightPress = useCallback(() => {
    setIsHeightModalVisible(true);
  }, []);

  const onCloseReachModal = useCallback(() => {
    setIsReachModalVisible(false);
  }, []);

  const onSubmitReachModal = useCallback((pickerReach) => {
    setReach(pickerReach);
    setIsReachModalVisible(false);
  }, []);

  const onReachPress = useCallback(() => {
    setIsReachModalVisible(true);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <WheelModal
        visible={isWeightModalVisible}
        options={weightOptions}
        initialValue={weightOptions[70]}
        onClose={onCloseWeightModal}
        onSubmit={onSubmitWeightModal}
      />
      <WheelModal
        visible={isHeightModalVisible}
        options={heightOptions}
        initialValue={footsToString(5, 9)}
        onClose={onCloseHeightModal}
        onSubmit={onSubmitHeightModal}
      />
      <WheelModal
        visible={isReachModalVisible}
        options={heightOptions}
        initialValue={footsToString(4, 5)}
        onClose={onCloseReachModal}
        onSubmit={onSubmitReachModal}
      />
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header isBackArrow title={t('PersonalInfo.PersonalInfo')} />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View>
          <View>
            <Text style={styles.inputLabel}>{t('PersonalInfo.weight')}</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={onWeightPress}
              activeOpacity={0.8}
            >
              <Text style={styles.input}>{weight || ''}</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.inputLabel}>{t('PersonalInfo.height')}</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={onHeightPress}
              activeOpacity={0.8}
            >
              <Text style={styles.input}>{height || ''}</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.inputLabel}>{t('PersonalInfo.reach')}</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={onReachPress}
              activeOpacity={0.8}
            >
              <Text style={styles.input}>{reach || ''}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Next"
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default PersonalInfo;
