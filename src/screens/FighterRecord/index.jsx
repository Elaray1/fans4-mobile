import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import Text from 'components/Text';
import Input from 'components/Input';
import Header from 'components/Header';
import Button from 'components/Button';
import Toggle from 'components/Toggle';

import * as userActions from 'resources/user/user.actions';
import * as userSelectors from 'resources/user/user.selectors';
import { FIGHTER_TYPES } from 'resources/user/user.constants';

import analyticsService from 'services/analytics.service';

import styles from './styles';

const FighterRecord = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [wins, setWins] = useState(null);
  const [losses, setLosses] = useState(null);
  const [draws, setDraws] = useState(null);
  const [winsPro, setWinsPro] = useState(null);
  const [lossesPro, setLossesPro] = useState(null);
  const [drawsPro, setDrawsPro] = useState(null);
  const [type, setType] = useState(FIGHTER_TYPES.AMATEUR);

  const userId = useSelector(userSelectors.getUserId);

  const types = useMemo(() => [
    { id: FIGHTER_TYPES.AMATEUR, value: t('FighterRecord.amateur') },
    { id: FIGHTER_TYPES.PRO, value: t('FighterRecord.pro') },
  ], [t]);

  const {
    fullName,
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

  const isDisabled = (type === FIGHTER_TYPES.AMATEUR)
    ? (!wins || !draws || !losses)
    : (!winsPro || !drawsPro || !lossesPro);

  const onChangeWins = useCallback((text) => {
    setWins(text.replace(/[^0-9]/g, ''));
  }, []);

  const onChangeLosses = useCallback((text) => {
    setLosses(text.replace(/[^0-9]/g, ''));
  }, []);

  const onChangeDraws = useCallback((text) => {
    setDraws(text.replace(/[^0-9]/g, ''));
  }, []);

  const onChangeWinsPro = useCallback((text) => {
    setWinsPro(text.replace(/[^0-9]/g, ''));
  }, []);

  const onChangeLossesPro = useCallback((text) => {
    setLossesPro(text.replace(/[^0-9]/g, ''));
  }, []);

  const onChangeDrawsPro = useCallback((text) => {
    setDrawsPro(text.replace(/[^0-9]/g, ''));
  }, []);

  const onToggleSelect = useCallback((item) => {
    setType(item.id);
  }, []);

  const onSubmit = useCallback(async () => {
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
        fighterType: type,
        wins,
        losses,
        draws,
        winsPro,
        lossesPro,
        drawsPro,
        weightClasses,
        avatar: {
          name: 'image',
          type: photo?.mime,
          uri: Platform.OS === 'android' ? photo?.path : photo?.path.replace('file://', ''),
        },
      }));

      analyticsService.logEvent({
        name: analyticsService.events.FIGHTER_FORM_SUBMITTED,
        data: {
          userId,
        },
      });

      navigation.navigate('TermsOfUse');
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, fullName, nickname, gender, birthdate,
    cityId, weight, height, reach, type, wins, losses,
    draws, winsPro, lossesPro, drawsPro, weightClasses,
    photo?.mime, photo?.path, userId, navigation]);

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
                  value={winsPro ?? ''}
                  type="number"
                  onChange={onChangeWinsPro}
                  label={t('FighterRecord.wins')}
                  style={styles.recordInput}
                />
                <Input
                  value={lossesPro ?? ''}
                  type="number"
                  onChange={onChangeLossesPro}
                  label={t('FighterRecord.losses')}
                  style={styles.recordInput}
                />
                <Input
                  value={drawsPro ?? ''}
                  type="number"
                  onChange={onChangeDrawsPro}
                  label={t('FighterRecord.draws')}
                  style={styles.recordInput}
                />
              </View>
              <Text style={styles.text}>{t('FighterRecord.amateurRecord')}</Text>
            </>
          )}
          <View style={styles.record}>
            <Input
              value={wins ?? ''}
              type="number"
              onChange={onChangeWins}
              label={t('FighterRecord.wins')}
              style={styles.recordInput}
            />
            <Input
              value={losses ?? ''}
              type="number"
              onChange={onChangeLosses}
              label={t('FighterRecord.losses')}
              style={styles.recordInput}
            />
            <Input
              value={draws ?? ''}
              type="number"
              onChange={onChangeDraws}
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
