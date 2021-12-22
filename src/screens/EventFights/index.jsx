import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView, View, FlatList, ActivityIndicator, TouchableOpacity, Alert, ScrollView, RefreshControl,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import * as fightApi from 'resources/fight/fight.api';

import * as userSelectors from 'resources/user/user.selectors';

import Header from 'components/Header';
import FightItem from 'components/FightItem';
import Text from 'components/Text';
import Button from 'components/Button';

import useToast from 'hooks/useToast';

import analyticsService from 'services/analytics.service';

import colors from 'themes/colors';

import { EVENT_STATUSES } from 'resources/event/event.constants';
import { FIGHT_STATUSES } from 'resources/fight/fight.constants';
import { USER_TYPES } from 'resources/user/user.constants';
import { FIGHT_VIEW_TYPE } from 'components/FightItem/constants';

import { toLocalDateAndTime } from 'helpers/toLocalTime';

import LiveIcon from 'assets/icons/live.svg';
import PlusIcon from 'assets/icons/grey-plus';

import styles from './styles';

const PER_PAGE_COUNT = 10;

const posterAspectRatio = 16 / 9;
const aspectRatioStyle = { aspectRatio: posterAspectRatio };

function EventFights({ route }) {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const { event } = route?.params;

  const [fights, setFights] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userSubscriptions = useSelector(userSelectors.getSupportedFighters);
  const userType = useSelector(userSelectors.getUserType);

  const isFan = userType === USER_TYPES.FAN;
  const isCancelledOrPast = event.status === EVENT_STATUSES.CANCELED || event.status === EVENT_STATUSES.PAST;

  useEffect(() => {
    if (isFan) {
      analyticsService.logEvent({
        name: analyticsService.events.FAN_OPENED_EVENT_SCREEN,
        data: {
          eventId: event._id,
        },
      });
    }
  }, [isFan, event._id]);

  const fetchNewItems = useCallback(async ({ refresh } = {}) => {
    let fetchingPage = 1;
    let currentFights = [];

    if (!refresh) {
      fetchingPage = page;
      currentFights = fights;
    }

    if (fetchingPage === 1 || currentFights.length < totalCount) {
      setIsLoading(true);
      try {
        const {
          fights: fetchedFights,
          totalCount: fetchedTotalCount,
        } = await fightApi.getFights({
          page: fetchingPage,
          perPage: PER_PAGE_COUNT,
          eventId: event._id,
        });
        setPage(fetchingPage + 1);
        setTotalCount(fetchedTotalCount);
        setFights([...currentFights, ...fetchedFights]);
      } catch (error) {
        showFailure(t('EventFights.couldntLoadTheFightsPullToRefresh'));
      }
      setIsLoading(false);
    }
  }, [totalCount, page, fights, event._id, showFailure, t]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchNewItems({ refresh: true });
    setIsRefreshing(false);
  }, [fetchNewItems]);

  const navigateToPropose = useCallback(() => {
    if (userSubscriptions.length) {
      navigation.navigate('ProposeAFight');
    } else {
      Alert.alert(
        t('Voting.subscription'),
        t('Voting.youHaveToBeSubscribed'),
        [
          { text: t('Voting.ok') },
        ],
      );
    }
  }, [navigation, t, userSubscriptions?.length]);

  const navigateToFightersList = useCallback(() => {
    navigation.navigate('Tabs', {
      screen: 'Fighters',
    });
  }, [navigation]);

  useEffect(() => {
    const fetchFights = async () => {
      await fetchNewItems();
    };

    fetchFights();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyExtractor = useCallback(item => item._id, []);

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
  };

  const progress = `${(event.fights.filter(
    fight => fight.results !== undefined,
  ).length) / event.fights.length * 100}%`;

  const isLive = event.status === EVENT_STATUSES.PAST
  && event.fights.some(fight => !fight.results);
  const isUpcoming = event.status === EVENT_STATUSES.UPCOMING;

  const renderItem = ({ item }) => {
    const indexOfFightWithoutResults = fights.map(f => f.results || 0).indexOf(0);
    let isShowText = false;
    if (indexOfFightWithoutResults) {
      isShowText = item._id === fights[indexOfFightWithoutResults - 1]._id;
    }
    return (
      <>
        <FightItem
          fight={item}
          isCountdownShown
          viewType={item.status === FIGHT_STATUSES.PAST ? FIGHT_VIEW_TYPE.EVENT_PAST : FIGHT_VIEW_TYPE.EVENT_UPCOMING}
        />
        {isLive && isShowText && <Text style={styles.stayTuned}>{t('Events.stayTuned')}</Text>}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={event.name}
        leftItemType="backArrow"
      />
      <View style={styles.content}>
        <View
          style={styles.event}
        >
          <View style={[styles.eventImageContainer, aspectRatioStyle]}>
            <FastImage
              style={[styles.photoImage, aspectRatioStyle]}
              source={{ uri: event.imageUrl }}
            />
            {event.status === EVENT_STATUSES.CANCELED
            && moment().isBefore(event.date)
            && (
            <View style={styles.imageStatus}>
              <Text style={styles.imageText}>{t('Events.canceled')}</Text>
            </View>
            )}
            {isLive && (
              <>
                <View style={styles.live}>
                  <LiveIcon />
                  <Text>{t('Events.live')}</Text>
                </View>
                <View style={styles.line}>
                  <View style={[styles.progress, {
                    width: progress,
                  }]}
                  />
                </View>
              </>
            )}
            {isUpcoming && (
            <View style={styles.upcoming}>
              <LiveIcon />
              <Text style={styles.upcomingText}>
                {`${t('Events.liveOn')} ${toLocalDateAndTime(event)} `}
                {`${t('Events.in')} ${event.location.cityName}, ${event.location.stateCode}`}
              </Text>
            </View>
            )}
          </View>
        </View>
        {isLoading && <Loader />}
        {!isLoading && !!fights.length
          && (
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
          )}
        {!isLoading && !fights.length && !isCancelledOrPast && (
          <ScrollView
            contentContainerStyle={styles.noFightsContainer}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.noFightsTitle}>{t('EventFights.stayedTunedForFightCard')}</Text>
            {isFan ? (
              <>
                <Text style={styles.noFightsText}>
                  {t('EventFights.wantToSeeYourFighterInUpcomingEvents')}
                </Text>
                <TouchableOpacity style={styles.button} onPress={navigateToPropose}>
                  <PlusIcon />
                  <Text style={styles.buttonText}>{t('EventFights.propose')}</Text>
                </TouchableOpacity>
              </>
            )
              : (
                <>
                  <Text style={styles.noFightsText}>
                    {t('EventFights.wantToFightInUpcomingEvents')}
                  </Text>
                  <Button title={t('EventFights.chooseFighter')} onPress={navigateToFightersList} />
                </>
              )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

EventFights.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      event: PropTypes.shape().isRequired,
    }),
  }).isRequired,
};

export default React.memo(EventFights);
