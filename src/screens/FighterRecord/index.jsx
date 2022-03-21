import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import Text from 'components/Text';
import Input from 'components/Input';
import Header from 'components/Header';
import Button from 'components/Button';
import Toggle from 'components/Toggle';

import * as userActions from 'resources/user/user.actions';
import { FIGHTER_TYPES } from 'resources/user/user.constants';

import analyticsService from 'services/analytics.service';

import styles from './styles';

const FighterRecord = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [record, setRecord] = useState({
    wins: '',
    losses: '',
    draws: '',
  });
  const [recordPro, setRecordPro] = useState({
    wins: '',
    losses: '',
    draws: '',
  });
  const [type, setType] = useState(FIGHTER_TYPES.AMATEUR);

  const types = useMemo(() => [
    { id: FIGHTER_TYPES.AMATEUR, value: t('FighterRecord.amateur') },
    { id: FIGHTER_TYPES.PRO, value: t('FighterRecord.pro') },
  ], [t]);

  const {
    firstName,
    lastName,
    nickname,
    birthdate,
    cityId,
    gender,
    photo,
    weight,
    height,
    reach,
    weightClasses,
  } = route?.params;

  const isDisabled = useMemo(() => {
    return (type === FIGHTER_TYPES.AMATEUR)
      ? (!record.wins || !record.draws || !record.losses)
      : (!recordPro.wins || !recordPro.draws || !recordPro.losses);
  }, [record.draws, record.losses, record.wins, recordPro.draws, recordPro.losses, recordPro.wins, type]);

  const onRecordChange = useCallback((text, field) => {
    const rec = {
      ...record,
      [field]: text.replace(/[^0-9]/g, text),
    };
    setRecord(rec);
  }, [record]);

  const onRecordProChange = useCallback((text, field) => {
    const rec = {
      ...recordPro,
      [field]: text.replace(/[^0-9]/g, text),
    };
    setRecordPro(rec);
  }, [recordPro]);

  const onToggleSelect = useCallback((item) => {
    setType(item.id);
  }, []);

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      await dispatch(userActions.fillRegistrationForm({
        firstName,
        lastName,
        nickname,
        gender,
        birthdate,
        cityId,
        weight,
        height,
        reach,
        fighterType: type,
        wins: record.wins,
        losses: record.losses,
        draws: record.draws,
        winsPro: recordPro.wins,
        lossesPro: recordPro.losses,
        drawsPro: recordPro.draws,
        weightClasses,
        avatar: {
          name: 'image',
          type: photo?.mime,
          uri: Platform.OS === 'android' ? photo?.path : photo?.path.replace('file://', ''),
        },
      }));

      analyticsService.logEvent({
        name: analyticsService.events.FIGHTER_FORM_SUBMITTED,
      });

      navigation.navigate('TermsOfUse');
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [dispatch, firstName,
    lastName, nickname, gender, birthdate,
    cityId, weight, height, reach, type, record.wins,
    record.losses, record.draws, recordPro.wins,
    recordPro.losses, recordPro.draws, weightClasses,
    photo?.mime, photo?.path, navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <Header leftItemType="backArrow" title={t('FighterRecord.fighterRecord')} />
      <View style={styles.content}>
        <View>
          <Toggle
            items={types}
            selectedItemId={type}
            onSelect={onToggleSelect}
          />
          {type === FIGHTER_TYPES.PRO && (
            <><Text style={styles.text}>{t('FighterRecord.proRecord')}</Text>
              <View style={styles.record}>
                <Input
                  value={recordPro.wins}
                  type="number"
                  onChange={text => onRecordProChange(text, 'wins')}
                  label={t('FighterRecord.wins')}
                  style={styles.recordInput}
                />
                <Input
                  value={recordPro.losses}
                  type="number"
                  onChange={text => onRecordProChange(text, 'losses')}
                  label={t('FighterRecord.losses')}
                  style={styles.recordInput}
                />
                <Input
                  value={recordPro.draws}
                  type="number"
                  onChange={text => onRecordProChange(text, 'draws')}
                  label={t('FighterRecord.draws')}
                  style={styles.recordInput}
                />
              </View>
              <Text style={styles.text}>{t('FighterRecord.amateurRecord')}</Text>
            </>
          )}
          <View style={styles.record}>
            <Input
              value={record.wins}
              type="number"
              onChange={text => onRecordChange(text, 'wins')}
              label={t('FighterRecord.wins')}
              style={styles.recordInput}
            />
            <Input
              value={record.losses}
              type="number"
              onChange={text => onRecordChange(text, 'losses')}
              label={t('FighterRecord.losses')}
              style={styles.recordInput}
            />
            <Input
              value={record.draws}
              type="number"
              onChange={text => onRecordChange(text, 'draws')}
              label={t('FighterRecord.draws')}
              style={styles.recordInput}
            />
          </View>
        </View>
        <Button
          title={t('FighterRecord.submit')}
          isLoading={isLoading}
          disabled={isDisabled}
          onPress={onSubmit}
        />
      </View>
    </SafeAreaView>
  );
};

FighterRecord.propTypes = {
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
      weight: PropTypes.string.isRequired,
      height: PropTypes.string.isRequired,
      reach: PropTypes.string.isRequired,
      weightClasses: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
};

export default React.memo(FighterRecord);
