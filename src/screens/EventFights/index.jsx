import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View, FlatList, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';

import * as fightApi from 'resources/fight/fight.api';
import { EVENT_STATUSES } from 'resources/event/event.constants';
import { FIGHT_STATUSES } from 'resources/fight/fight.constants';
import { USER_TYPES } from 'resources/user/user.constants';
import * as userSelectors from 'resources/user/user.selectors';

import Header from 'components/Header';
import FightItem from 'components/FightItem';
import { FIGHT_VIEW_TYPE } from 'components/FightItem/constants';
import Text from 'components/Text';

import useToast from 'hooks/useToast';

import analyticsService from 'services/analytics.service';

import colors from 'themes/colors';

import { toLocalDateAndTime } from 'helpers/toLocalTime';

import LiveIcon from 'assets/icons/live.svg';

import styles from './styles';

const PER_PAGE_COUNT = 10;

function EventFights({ route }) {
  const { t } = useTranslation();
  const { showFailure } = useToast();

  const { event } = route?.params;

  const [fights, setFights] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userType = useSelector(userSelectors.getUserType);

  useEffect(() => {
    if (userType === USER_TYPES.FAN) {
      analyticsService.logEvent({
        name: analyticsService.events.FAN_OPENED_EVENT_SCREEN,
        data: {
          eventId: event._id,
        },
      });
    }
  }, [userType, event._id]);

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

  useEffect(() => {
    const fetchFights = async () => {
      await fetchNewItems();
    };

    fetchFights();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <FightItem
        fight={item}
        isCountdownShown
        viewType={item.status === FIGHT_STATUSES.PAST ? FIGHT_VIEW_TYPE.EVENT_PAST : FIGHT_VIEW_TYPE.EVENT_UPCOMING}
      />
    );
  };

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
  };
  const progress = `${(event.fights.filter(
    fight => fight.results !== undefined,
  )
    .length) / event.fights.length * 100}%`;
  const isLive = event.status === EVENT_STATUSES.PAST
  && event.fights.some(fight => !fight.results);
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
          <View style={styles.eventImageContainer}>
            <FastImage
              style={styles.photoImage}
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
            <View style={styles.live}>
              <LiveIcon />
              <Text>{t('Events.live')}</Text>
            </View>
            )}
            {isLive && (
            <View style={styles.line}>
              <View style={[styles.progress, {
                width: progress,
              }]}
              />
            </View>
            )}
          </View>
          <View>
            <Text style={styles.titleEvent}>{event.name}</Text>
            <Text style={styles.text}>{toLocalDateAndTime(event)}</Text>
            <Text style={styles.text}>
              {`${event.location.cityName}, ${event.location.stateCode}`}
            </Text>
          </View>
        </View>
        {isLive && <Text style={styles.stayTuned}>{t('Events.stayTuned')}</Text>}
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
      event: PropTypes.shape().isRequired,
    }),
  }).isRequired,
};

export default React.memo(EventFights);
