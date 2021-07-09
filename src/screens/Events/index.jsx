import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import {
  SafeAreaView, View, FlatList, ActivityIndicator, Image, TouchableOpacity, ScrollView, RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';

import * as eventApi from 'resources/event/event.api';
import * as userSelectors from 'resources/user/user.selectors';
import { EVENT_STATUSES } from 'resources/event/event.constants';
import { USER_TYPES } from 'resources/user/user.constants';

import Header from 'components/Header';
import Text from 'components/Text';
import Toggle from 'components/Toggle';

import useToast from 'hooks/useToast';

import LiveIcon from 'assets/icons/live.svg';

import colors from 'themes/colors';

import { toLocalDateAndTime } from 'helpers/toLocalTime';

import styles from './styles';

const TABS = { UPCOMING: 'upcoming', PAST: 'past' };

const PER_PAGE_COUNT = 20;

function Events() {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userType = useSelector(userSelectors.getUserType);

  const tabs = useMemo(() => {
    return [
      {
        id: '1',
        name: TABS.UPCOMING,
        value: t('Events.upcoming'),
        emptyView: {
          title: t('Events.noEventsYet'),
          text: t('Events.onceEventsAreScheduledYouWillSeeThemHere'),
        },
      },
      {
        id: '2',
        name: TABS.PAST,
        value: t('Events.past'),
        emptyView: {
          title: t('Events.noEventsYet'),
          text: t('Events.onceYouParticipateInAnEventItWillBeShownOnThisPage'),
        },
      },
    ];
  }, [t]);

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <View style={styles.illustration} />
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
    } else {
      setIsRefreshing(true);
    }

    if (fetchingPage === 1 || currentEvents.length < totalCount) {
      setIsLoading(true);
      try {
        const {
          events: fetchedEvents,
          totalCount: fetchedTotalCount,
        } = await eventApi.getEvents({
          isFan: userType === USER_TYPES.FAN,
          page: fetchingPage,
          perPage: PER_PAGE_COUNT,
          statuses: selectedTab.name === TABS.UPCOMING
            ? [EVENT_STATUSES.UPCOMING, EVENT_STATUSES.CANCELED, EVENT_STATUSES.PAST]
            : [EVENT_STATUSES.PAST],
          unfinished: selectedTab.name === TABS.UPCOMING,
          isOnlyNotFinshedIfCanceled: selectedTab.name === TABS.UPCOMING,
        });
        setPage(fetchingPage + 1);
        setTotalCount(fetchedTotalCount);
        setEvents([...currentEvents, ...fetchedEvents]);
      } catch (error) {
        showFailure(t('Events.couldntLoadTheEventsPullToRefresh'));
      }
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [totalCount, page, events, userType, selectedTab.name, showFailure, t]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchNewItems({ refresh: true });
    setIsRefreshing(false);
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
    const progress = `${(item.fights.filter(
      fight => fight.results !== undefined,
    )
      .length) / item.fights.length * 100}%`;
    const isLive = item.status === EVENT_STATUSES.PAST
    && item.fights.some(fight => !fight.results);
    return (
      <TouchableOpacity
        onPress={() => onEventPress(item)}
        activeOpacity={0.7}
        style={styles.event}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.photoImage}
            source={{ uri: item.imageUrl }}
          />
          {item.status === EVENT_STATUSES.CANCELED
          && moment().isBefore(item.date)
          && (
          <View style={styles.imageStatus}>
            <Text style={styles.imageText}>{t('Events.canceled')}</Text>
          </View>
          )}
          {isLive && (
          <View style={styles.live}>
            <LiveIcon />
            <Text>Live</Text>
          </View>
          )}
          {isLive
          && (
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
    setSelectedTab(item);
    // await fetchNewItems({ refresh: true, eventTypes: item.eventTypes });
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Events.events')}
      />
      <View style={styles.content}>
        <Toggle items={tabs} onSelect={onToggleSelect} selectedItemId={selectedTab.id} />
        {isRefreshing && <Loader />}
        {!isRefreshing && (events.length ? (
          <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReachedThreshold={0.3}
            onEndReached={fetchNewItems}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            keyboardShouldPersistTaps="handled"
          >
            <EmptyView />
          </ScrollView>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default React.memo(Events);
