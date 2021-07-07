import React, {
  useCallback, useState, useEffect,
} from 'react';
import {
  View, SafeAreaView, ScrollView, Image, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import * as userApi from 'resources/user/user.api';

import Header from 'components/Header';
import Text from 'components/Text';
import SearchInput from 'components/SearchInput';

import colors from 'themes/colors';

import Fighter from './components/fighter';

import styles from './styles';

const ProposeAFight = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [fighters, setFighters] = useState([]);
  const [firstFighter, setFirstFighter] = useState(null);
  const [secondFighter, setSecondFighter] = useState(null);

  const [search, setSearch] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState(0);
  const setStepOne = useCallback(() => setStep(0), []);
  const setStepTwo = useCallback(() => setStep(1), []);

  useEffect(() => {
    async function fetchFighters() {
      try {
        setIsLoading(true);

        const { users } = await userApi.getFightersForFight({
          opponentId: step === 1 ? firstFighter._id : null,
          search: step === 1 ? search : null,
        });
        setFighters(users);
      } catch (error) {
        console.error('Fetching fighters error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFighters();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, step]);


  const suggestAFight = useCallback(async () => {
    try {
      const { status, fight } = await userApi.suggestFight({
        firstFighterId: firstFighter._id,
        secondFighterId: secondFighter._id,
      });

      navigation.navigate('Tabs', {
        screen: 'Voting',
        params: {
          screen: 'Voting',
          params: { status, fight },
        },
      });
    } catch (error) {
      console.error('Suggesting fight error:', error);
    }
  }, [firstFighter?._id, secondFighter?._id, navigation]);

  const disabled = (step === 0 && !firstFighter) || (step === 1 && !secondFighter);

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="small" color={colors.primary} /></View>;

  const onReload = useCallback(() => {
    setSearch('');
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('ProposeAFight.ProposeAFight')}
        leftItemType="backArrow"
        rightItemType="text"
        rightItemText={step === 0 ? t('ProposeAFight.next') : t('ProposeAFight.create')}
        onLeftItemPress={step === 0 ? null : setStepOne}
        onRightItemPress={step === 0 ? setStepTwo : suggestAFight}
        rightItemDisabled={disabled}
        rightItemStyle={disabled ? styles.disabled : null}
      />
      <View style={styles.content}>
        <View style={styles.fightersContainer}>
          <View style={styles.fightersBlock}>
            <View style={styles.leftBlock}>
              {firstFighter
                ? (

                  <View>
                    <Image
                      style={styles.image}
                      source={{ uri: firstFighter.avatarUrl }}
                    />
                    <Text style={[styles.caption, styles.leftFighter]}>{firstFighter.fullName}</Text>
                  </View>
                )
                : <View style={styles.fighterPicturePlaceholder} />
              }
            </View>
            <Text style={styles.vs}>vs</Text>
            <View style={styles.rightBlock}>
              {secondFighter
                ? (
                  <View>
                    <Image
                      style={styles.image}
                      source={{ uri: secondFighter.avatarUrl }}
                    />
                    <Text style={styles.caption}>{secondFighter.fullName}</Text>
                  </View>
                )
                : <View style={styles.fighterPicturePlaceholder} />
              }
            </View>
          </View>
        </View>
        <ScrollView style={styles.fightersList}>
          <Text style={styles.title}>
            {step === 0 ? t('ProposeAFight.chooseFighter') : t('ProposeAFight.chooseOpponent')}
          </Text>

          {step === 1 && (
            <View style={styles.search}>
              <SearchInput
                value={search}
                onChangeText={setSearch}
                placeholder={t('ProposeAFight.search')}
              />
            </View>
          )}

          {fighters.map(fighter => (
            <Fighter
              key={fighter._id}
              fighter={fighter}
              isSelected={step === 0 ? fighter._id === firstFighter?._id : fighter._id === secondFighter?._id}
              setFighter={step === 0 ? setFirstFighter : setSecondFighter}
              firstFighterWeightClasses={step === 0 ? null : firstFighter?.role?.profile?.weightClasses}
            />
          ))}

          {isLoading && <Loader />}

          {!fighters.length && !isLoading && (
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

export default React.memo(ProposeAFight);
