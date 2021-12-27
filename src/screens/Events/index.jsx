import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  SafeAreaView, View, FlatList, ActivityIndicator, TouchableOpacity, ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';

import * as eventApi from 'resources/event/event.api';
import * as userSelectors from 'resources/user/user.selectors';
import { EVENT_STATUSES, LIVE_STREAM_STATUSES } from 'resources/event/event.constants';
import { USER_TYPES } from 'resources/user/user.constants';

import Header from 'components/Header';
import Text from 'components/Text';
import Toggle from 'components/Toggle';
import CustomRefreshControl from 'components/CustomRefreshControl';

import useToast from 'hooks/useToast';

import LiveIcon from 'assets/icons/live.svg';
import NoEventsIllustration from 'assets/illustrations/no-events.svg';

import colors from 'themes/colors';

import { toLocalDateAndTime } from 'helpers/toLocalTime';

import analyticsService from 'services/analytics.service';

import styles from './styles';

const TABS = { UPCOMING: 'upcoming', PAST: 'past' };

const PER_PAGE_COUNT = 20;

const posterAspectRatio = 16 / 9;
const aspectRatioStyle = { aspectRatio: posterAspectRatio };

function Events() {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const userType = useSelector(userSelectors.getUserType);
  const isVotingCardsIndicator = useSelector(userSelectors.getVotingCardsIndicator);

  const listRef = useRef(null);
  useScrollToTop(listRef);

  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchedFirstTime, setIsFetchedFirstTime] = useState(false);

  useEffect(() => {
    if (userType === USER_TYPES.FIGHTER) {
      analyticsService.logEvent({
        name: analyticsService.events.FIGHTER_OPENED_EVENTS_SCREEN,
      });
    } else {
      analyticsService.logEvent({
        name: analyticsService.events.FAN_OPENED_EVENTS_SCREEN,
      });
    }
  }, [userType]);

  const tabs = useMemo(() => {
    return [
      {
        id: '1',
        name: TABS.UPCOMING,
        value: t('Events.upcoming'),
        emptyView: {
          title: t('Events.noEventsYet'),
          text: userType === USER_TYPES.FAN ? t('Events.fanUpcoming') : t('Events.fighterUpcoming'),
        },
      },
      {
        id: '2',
        name: TABS.PAST,
        value: t('Events.past'),
        emptyView: {
          title: t('Events.noEventsYet'),
          text: userType === USER_TYPES.FAN
            ? t('Events.fanPast')
            : t('Events.fighterPast'),
        },
      },
    ];
  }, [t, userType]);

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoEventsIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{selectedTab.emptyView.title}</Text>
      <Text style={styles.text}>{selectedTab.emptyView.text}</Text>
    </View>
  );

  const fetchNewItems = useCallback(async ({ refresh, eventTypes } = {}) => {
    let fetchingPage = 1;
    let currentEvents = [];

    if (!refresh) {
      fetchingPage = page;
      currentEvents = events;
    }

    if (fetchingPage === 1 || currentEvents.length < totalCount) {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      let fetchedEvents;
      let fetchedTotalCount;

      try {
        if (userType === USER_TYPES.FAN) {
          ({
            events: fetchedEvents,
            totalCount: fetchedTotalCount,
          } = await eventApi.getEventsForFan({
            page: fetchingPage,
            perPage: PER_PAGE_COUNT,
            past: selectedTab.name !== TABS.UPCOMING,
          }));
        } else {
          ({
            events: fetchedEvents,
            totalCount: fetchedTotalCount,
          } = await eventApi.getEventsForCurrentFighter({
            page: fetchingPage,
            perPage: PER_PAGE_COUNT,
            past: selectedTab.name !== TABS.UPCOMING,
          }));
        }

        setPage(fetchingPage + 1);
        setTotalCount(fetchedTotalCount);
        setEvents([...currentEvents, ...(fetchedEvents || [])]);
      } catch (error) {
        console.error('error', error);
        showFailure(t('Events.couldntLoadTheEventsPullToRefresh'));
      }

      if (!isFetchedFirstTime) {
        setIsFetchedFirstTime(true);
      }

      if (refresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [totalCount, page, events, userType, selectedTab.name, showFailure, t, isFetchedFirstTime]);

  const onRefresh = useCallback(async () => {
    await fetchNewItems({ refresh: true });
  }, [fetchNewItems]);

  useEffect(() => {
    const fetchEvents = async () => {
      await fetchNewItems({ refresh: true });
    };

    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab.id]);

  const onEventPress = useCallback((event) => {
    navigation.navigate('EventFights', { event });
  }, [navigation]);

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    const progress = `${(item.fights.filter(fight => fight.results !== undefined).length) / item.fights.length * 100}%`;

    const isLive = item.status === EVENT_STATUSES.PAST
      && item.liveStream.status !== LIVE_STREAM_STATUSES.FINISHED;

    return (
      <TouchableOpacity
        onPress={() => onEventPress(item)}
        activeOpacity={0.7}
        style={styles.event}
      >
        <View style={[styles.imageContainer, aspectRatioStyle]}>
          <FastImage
            style={[styles.photoImage, aspectRatioStyle]}
            source={{ uri: item.imageUrl }}
          />

          {item.status === EVENT_STATUSES.CANCELLED && moment().isBefore(item.date) && (
          <View style={styles.imageStatus}>
            <Text style={styles.imageText}>{t('Events.cancelled')}</Text>
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
          <Text style={styles.titleText}>{item.name}</Text>
          <Text style={styles.text}>{toLocalDateAndTime(item)}</Text>
          <Text style={styles.text}>
            {`${item.location.cityName}, ${item.location.stateCode}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }
    return <Loader />;
  };

  const onToggleSelect = useCallback(async (item) => {
    setIsFetchedFirstTime(false);
    setSelectedTab(item);
    // await fetchNewItems({ refresh: true, eventTypes: item.eventTypes });
  }, []);

  const navigateToVoting = useCallback(() => {
    navigation.navigate('FighterVoting');
  }, [navigation]);

  const RightItem = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={navigateToVoting}
        style={styles.votingContainer}
      >
        <Text style={styles.votingText}>{t('Events.voting')}</Text>
        {isVotingCardsIndicator && <View style={styles.votingCardsIndicator} />}
      </TouchableOpacity>
    );
  };

  const RefreshControl = (
    <CustomRefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Events.events')}
        rightItem={userType === USER_TYPES.FIGHTER ? <RightItem /> : undefined}
        rightItemText={userType === USER_TYPES.FAN ? t('Events.voting') : undefined}
        onRightItemPress={userType === USER_TYPES.FAN ? navigateToVoting : undefined}
      />

      <View style={styles.content}>
        <Toggle items={tabs} onSelect={onToggleSelect} selectedItemId={selectedTab.id} />

        {!isFetchedFirstTime && isRefreshing && <Loader />}

        {!!events.length && (
          <FlatList
            ref={listRef}
            data={events}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.3}
            onEndReached={fetchNewItems}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            refreshControl={RefreshControl}
          />
        )}

        {isFetchedFirstTime && !events.length && (
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={RefreshControl}
            keyboardShouldPersistTaps="handled"
          >
            <EmptyView />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

export default React.memo(Events);
