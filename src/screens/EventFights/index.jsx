import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, FlatList, ActivityIndicator, Image, TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import * as fightApi from 'resources/fight/fight.api';

import * as userSelectors from 'resources/user/user.selectors';

import Header from 'components/Header';
import Text from 'components/Text';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import { toFixLength } from 'helpers/modifyText';

import styles from './styles';

const PER_PAGE_COUNT = 10;

function EventFights({ route }) {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const userId = useSelector(userSelectors.getUserId);

  const {
    title,
    eventId,
  } = route?.params;

  const [fights, setFights] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNewItems = useCallback(async ({ refresh } = {}) => {
    let fetchingPage = 1;
    let currentFights = [];

    if (!refresh) {
      fetchingPage = page;
      currentFights = fights;
    }

    if (page === 1 || currentFights.length < totalCount) {
      setIsLoading(true);
      try {
        const {
          fights: fetchedFights,
          totalCount: fetchedTotalCount,
        } = await fightApi.getFights({
          page: fetchingPage,
          perPage: PER_PAGE_COUNT,
          eventId,
        });
        setPage(fetchingPage + 1);
        setTotalCount(fetchedTotalCount);
        setFights([...currentFights, ...fetchedFights]);
      } catch (error) {
        showFailure(t('EventFights.couldntLoadTheFightsPullToRefresh'));
      }
      setIsLoading(false);
    }
  }, [fights, page, totalCount, showFailure, t, eventId]);

  const onFighterPress = useCallback((fighterId) => {
    if (userId === fighterId) {
      navigation.navigate('Account');
    } else {
      navigation.navigate('Fighter', { _id: fighterId });
    }
  }, [navigation, userId]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchNewItems({ refresh: true });
    setIsRefreshing(false);
  }, [fetchNewItems]);

  useEffect(() => {
    const fetchFights = async () => {
      await fetchNewItems();
    };

    fetchFights();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyExtractor = useCallback(item => item._id, []);

  /* eslint-disable react/prop-types */
  const Fighter = ({ fighter, isWinner, style }) => {
    return (
      <TouchableOpacity
        style={[styles.fighter, style]}
        onPress={() => onFighterPress(fighter._id)}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image
            style={[styles.photoImage, isWinner && styles.winnerImage]}
            source={{ uri: fighter.avatarUrl }}
          />
          {isWinner && (
          <View style={styles.winner}>
            <Text style={styles.winnerText}>{t('EventFights.winner')}</Text>
          </View>
          )}
        </View>
        <Text style={styles.captionText}>
          {toFixLength({ text: fighter.fullName, length: 30 })}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    const [firstFighter, secondFighter] = item.fighters;
    const location = `${item.event.location.cityName}, ${item.event.location.stateCode}`;
    const isWinner = Boolean(item.results?.winnerId);

    return (
      <View style={styles.fight} key={item._id}>
        <View style={styles.fightersInfo}>
          <View style={styles.fighters}>
            <Fighter
              fighter={firstFighter}
              isWinner={firstFighter._id === item.results?.winnerId}
              style={styles.firstFighter}
            />
            <Text style={[styles.captionText, styles.vs]}>
              {t('EventFights.vs')}
            </Text>
            <Fighter
              fighter={secondFighter}
              isWinner={secondFighter._id === item.results?.winnerId}
            />
          </View>
          <View style={styles.line} />
          {isWinner
            ? (
              <View>
                <Text style={styles.text}>
                  {`Round ${item.results.roundNumber}, ${moment.duration().asMinutes()}, ${item.results.winMethod}`}
                </Text>
              </View>
            )
            : (
              <View style={styles.location}>
                <Text style={styles.text}>{location}</Text>
                <Text style={styles.text}>{location}</Text>
              </View>
            )}
        </View>
      </View>
    );
  };

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
  };
  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={title}
        leftItemType="backArrow"
      />
      <View style={styles.content}>
        {isLoading ? <Loader /> : (Boolean(fights.length) && (
        <FlatList
          data={fights}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReachedThreshold={0.3}
          onEndReached={fetchNewItems}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderFooter}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
        />
        ))}
      </View>
    </SafeAreaView>
  );
}

EventFights.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      title: PropTypes.string.isRequired,
      eventId: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default React.memo(EventFights);
