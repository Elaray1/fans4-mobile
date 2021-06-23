import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, ScrollView, StatusBar, TouchableOpacity, Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import * as userActions from 'resources/user/user.actions';

import colors from 'themes/colors';

import Text from 'components/Text';
import Input from 'components/Input';
import Header from 'components/Header';
import Button from 'components/Button';
import WheelModal from 'components/WheelModal';
import WeightClassSelectModal from 'components/WeightClassSelectModal';

import styles from './PersonalInfo.styles';

const FOOTS = [4, 5, 6, 7];
const INCHES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const footsToString = (foot, inch) => `${foot}’ ${inch}”`;

function PersonalInfo({ route }) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    fullName,
    nickname,
    birthdate,
    cityId,
    gender,
    photo,
  } = route?.params;

  const [isLoading, setIsLoading] = useState(false);

  const [wins, setWins] = useState(null);
  const [losses, setLosses] = useState(null);
  const [draws, setDraws] = useState(null);

  const [weight, setWeight] = useState(null);
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);

  const [weightClasses, setWeightClasses] = useState([]);
  const [isWeightClassModalVisible, setIsWeighClassModalVisible] = useState(false);

  const [height, setHeight] = useState(null);
  const [isHeightModalVisible, setIsHeightModalVisible] = useState(false);

  const [reach, setReach] = useState(null);
  const [isReachModalVisible, setIsReachModalVisible] = useState(false);

  const heightOptions = useMemo(() => FOOTS.reduce((acc, foot) => {
    const footInches = INCHES.map(inch => footsToString(foot, inch));
    return [...acc, ...footInches];
  }, []), []);

  const reachOptions = useMemo(() => {
    // min value 48, max value 90
    const inches = (new Array(43).fill(48))
      .map((x, i) => `${x + i}”`);
    return inches;
  }, []);

  const weightOptions = useMemo(() => {
    // min value 100, max value 400
    const pounds = (new Array(301).fill(100))
      .map((x, i) => `${x + i} lbs`);

    return pounds;
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

  const onCloseWeightClassModal = useCallback(() => {
    setIsWeighClassModalVisible(false);
  }, []);

  const onSubmitWeightClassModal = useCallback((wc) => {
    setWeightClasses(wc);
    setIsWeighClassModalVisible(false);
  }, []);

  const onWeightClassPress = useCallback(() => {
    setIsWeighClassModalVisible(true);
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

  const onNextPress = useCallback(async () => {
    setIsLoading(true);

    try {
      await dispatch(userActions.fillRegistrationForm({
        fullName,
        nickname,
        gender,
        birthdate,
        cityId,
        weight,
        height,
        reach,
        wins,
        losses,
        draws,
        weightClasses: weightClasses.map(item => item.name),
        avatar: {
          name: 'image',
          type: photo?.mime,
          uri: Platform.OS === 'android' ? photo?.path : photo?.path.replace('file://', ''),
        },
      }));
      navigation.navigate('TermsOfUse');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, fullName, nickname,
    gender, birthdate, cityId,
    weight, height, reach, wins,
    losses, draws, weightClasses,
    photo?.mime, photo?.path, navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <WheelModal
        visible={isWeightModalVisible}
        options={weightOptions}
        initialValue={gender === 'male' ? weightOptions[70] : weightOptions[0]}
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
        options={reachOptions}
        initialValue={reachOptions[12]}
        onClose={onCloseReachModal}
        onSubmit={onSubmitReachModal}
      />
      <WeightClassSelectModal
        visible={isWeightClassModalVisible}
        onClose={onCloseWeightClassModal}
        onSubmit={onSubmitWeightClassModal}
        isFemale={gender === 'female'}
      />
      <StatusBar barStyle="light-content" backgroundColor={colors.main} />
      <Header leftItemType="backArrow" title={t('PersonalInfo.PersonalInfo')} />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View>
          <View style={styles.record}>
            <Input
              value={wins ?? ''}
              type="number"
              onChange={(text) => {
                setWins(text.replace(/[^0-9]/g, ''));
              }}
              label={t('PersonalInfo.wins')}
              style={styles.recordInput}
            />
            <Input
              value={losses ?? ''}
              type="number"
              onChange={(text) => {
                setLosses(text.replace(/[^0-9]/g, ''));
              }}
              label={t('PersonalInfo.losses')}
              style={styles.recordInput}
            />
            <Input
              value={draws ?? ''}
              type="number"
              onChange={(text) => {
                setDraws(text.replace(/[^0-9]/g, ''));
              }}
              label={t('PersonalInfo.draws')}
              style={styles.recordInput}
            />
          </View>
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
            <Text style={styles.inputLabel}>{t('PersonalInfo.weightClass')}</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={onWeightClassPress}
              activeOpacity={0.8}
            >
              <Text style={styles.input}>
                {weightClasses.map(item => item.name).join(', ')}
              </Text>
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
          title={t('PersonalInfo.submit')}
          isLoading={isLoading}
          disabled={!weight || !height || !reach || !weightClasses.length || !wins || !losses
          || !draws}
          onPress={onNextPress}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

PersonalInfo.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      fullName: PropTypes.string.isRequired,
      nickname: PropTypes.string,
      birthdate: PropTypes.string.isRequired,
      cityId: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      photo: PropTypes.shape({
        path: PropTypes.string.isRequired,
        mime: PropTypes.string.isRequired,
      }).isRequired,
    }),
  }).isRequired,
};

export default PersonalInfo;
