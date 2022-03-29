import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import * as userApi from 'resources/user/user.api';
import * as fightApi from 'resources/fight/fight.api';

import analyticsService from 'services/analytics.service';

import Header from 'components/Header';
import Text from 'components/Text';
import SearchInput from 'components/SearchInput';
import CustomRefreshControl from 'components/CustomRefreshControl';

import colors from 'themes/colors';

import { toFixLength } from 'helpers/modifyText';

import useIsConnected from 'hooks/useIsConnected';
import useToast from 'hooks/useToast';

import Fighter from './components/fighter';

import styles from './styles';

const ProposeAFight = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isConnected = useIsConnected();
  const { showFailure } = useToast();

  const [fightersStep1, setFightersStep1] = useState([]);
  const [fightersStep2, setFightersStep2] = useState([]);
  const [firstFighter, setFirstFighter] = useState(null);
  const [secondFighter, setSecondFighter] = useState(null);

  const { preselectedFighterId } = route.params || {};

  const [search, setSearch] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState(0);
  const setStepOne = useCallback(() => setStep(0), []);
  const setStepTwo = useCallback(() => setStep(1), []);

  const isStep1 = step === 0;

  useEffect(() => {
    analyticsService.logEvent({
      name: analyticsService.events.FAN_STARTED_PROPOSE_FIGHT,
    });
  }, []);

  const fetchNewItems = useCallback(async () => {
    try {
      setIsLoading(true);

      const { fighters: fetchedFighters } = await userApi.getFightersForFight({
        opponentId: !isStep1 ? firstFighter._id : null,
        search: isStep1 ? null : search,
      });

      if (isStep1) {
        setFightersStep1(fetchedFighters);
      } else {
        setFightersStep2(fetchedFighters);
      }

      if (preselectedFighterId) {
        const preselectedFighter = fetchedFighters.find(f => f._id === preselectedFighterId);
        if (preselectedFighter) {
          setFirstFighter(preselectedFighter);
        }
      }
    } catch (error) {
      console.error('Fetching fighters error:', error);
      showFailure();
    }
    setIsLoading(false);
  }, [firstFighter?._id, isStep1, preselectedFighterId, search, showFailure]);

  useEffect(() => {
    const fetchFighters = async () => {
      await fetchNewItems();
    };

    fetchFighters();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, step]);

  const suggestAFight = useCallback(async () => {
    try {
      await fightApi.suggestFight({
        firstFighterId: firstFighter._id,
        secondFighterId: secondFighter._id,
      });

      navigation.navigate('FightWasSentToReview');

      analyticsService.logEvent({
        name: analyticsService.events.FAN_PROPOSED_FIGHT,
      });
    } catch (error) {
      console.error('Suggesting fight error:', error);
    }
  }, [firstFighter?._id, secondFighter?._id, navigation]);

  const disabled = (isStep1 && !firstFighter) || (!isStep1 && !secondFighter) || !isConnected;

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="small" color={colors.primary} /></View>;

  const onReload = useCallback(() => {
    setSearch('');
  }, []);

  const onRefresh = useCallback(async () => {
    await fetchNewItems();
  }, [fetchNewItems]);

  const RefreshControl = (
    <CustomRefreshControl
      refreshing={isLoading}
      onRefresh={onRefresh}
    />
  );


  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('ProposeAFight.ProposeAFight')}
        leftItemType="backArrow"
        rightItemType="text"
        rightItemText={isStep1 ? t('ProposeAFight.next') : t('ProposeAFight.create')}
        onLeftItemPress={isStep1 ? null : setStepOne}
        onRightItemPress={isStep1 ? setStepTwo : suggestAFight}
        rightItemDisabled={disabled}
        rightItemStyle={disabled ? styles.disabled : null}
      />

      <View style={styles.content}>
        <View style={styles.fightersContainer}>
          <View style={styles.fightersBlock}>
            <View>
              {firstFighter
                ? (
                  <View style={[styles.fighter, styles.firstFighter]}>
                    <FastImage
                      style={styles.image}
                      source={{ uri: firstFighter.avatarUrl }}
                    />
                    <Text style={styles.caption}>
                      {toFixLength({ text: `${firstFighter.firstName} ${firstFighter.lastName}`, length: 30 })}
                    </Text>
                  </View>
                )
                : <View style={styles.fighterPicturePlaceholder} />
              }
            </View>

            <Text style={styles.vs}>vs</Text>

            <View>
              {secondFighter
                ? (
                  <View style={[styles.fighter, styles.secondFighter]}>
                    <FastImage
                      style={styles.image}
                      source={{ uri: secondFighter.avatarUrl }}
                    />
                    <Text style={styles.caption}>
                      {toFixLength({ text: `${secondFighter.firstName} ${secondFighter.lastName}`, length: 30 })}
                    </Text>
                  </View>
                )
                : (
                  <TouchableOpacity disabled={!firstFighter} onPress={setStepTwo}>
                    <View style={styles.fighterPicturePlaceholder} />
                  </TouchableOpacity>
                )
              }
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.fightersList}
          keyboardShouldPersistTaps="handled"
          refreshControl={RefreshControl}
        >
          <Text style={styles.title}>
            {isStep1 ? t('ProposeAFight.chooseFighter') : t('ProposeAFight.chooseOpponent')}
          </Text>

          {!isStep1 && (
            <View style={styles.search}>
              <SearchInput
                value={search}
                onChangeText={setSearch}
                placeholder={t('ProposeAFight.search')}
              />
            </View>
          )}

          {(isStep1 ? fightersStep1 : fightersStep2).map(fighter => (
            <Fighter
              key={fighter._id}
              fighter={fighter}
              isSelected={isStep1 ? fighter._id === firstFighter?._id : fighter._id === secondFighter?._id}
              setFighter={isStep1 ? setFirstFighter : setSecondFighter}
              firstFighterWeightClasses={isStep1 ? null : firstFighter?.role?.profile?.weightClasses}
            />
          ))}

          {isLoading && <Loader />}

          {!(isStep1 ? fightersStep1 : fightersStep2).length && !isLoading && (
            <View style={styles.emptyView}>
              <Text>{t('ProposeAFight.noFighters')}</Text>
              <TouchableOpacity style={styles.showFullListButton} onPress={onReload}>
                <Text style={styles.showFullListButtonText}>{t('ProposeAFight.showFullList')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

ProposeAFight.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      preselectedFighterId: PropTypes.string,
    }),
  }),
};

ProposeAFight.defaultProps = {
  route: {},
};

export default React.memo(ProposeAFight);
