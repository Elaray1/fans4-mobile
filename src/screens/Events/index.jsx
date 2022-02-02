import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  SafeAreaView, View, ActivityIndicator, TouchableOpacity, ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import * as eventApi from 'resources/event/event.api';
import * as userSelectors from 'resources/user/user.selectors';
import { USER_TYPES } from 'resources/user/user.constants';

import FlatList from 'components/FlatList';
import Header from 'components/Header';
import Text from 'components/Text';
import Toggle from 'components/Toggle';
import CustomRefreshControl from 'components/CustomRefreshControl';

import useToast from 'hooks/useToast';

import NoEventsIllustration from 'assets/illustrations/no-events.svg';

import colors from 'themes/colors';

import analyticsService from 'services/analytics.service';

import EventItem from './components/EventItem';

import styles from './styles';

const TABS = { UPCOMING: 'upcoming', PAST: 'past' };

const PER_PAGE_COUNT = 20;

function Events() {
  const { t } = useTranslation();
  const { showFailure } = useToast();
  const navigation = useNavigation();

  const userType = useSelector(userSelectors.getUserType);
  const isVotingCardsIndicator = useSelector(userSelectors.getVotingCardsIndicator);

  const listRef = useRef(null);
  useScrollToTop(listRef);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
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

  const isUpcomingShown = selectedTab.name === TABS.UPCOMING;

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <NoEventsIllustration style={styles.illustration} />
      <Text style={styles.titleText}>{selectedTab.emptyView.title}</Text>
      <Text style={styles.text}>{selectedTab.emptyView.text}</Text>
    </View>
  );

  const fetchNewItems = useCallback(async ({ refresh } = {}) => {
    let fetchingPage = 1;
    let currentEvents = [];

    if (!refresh) {
      fetchingPage = page;
      currentEvents = isUpcomingShown ? upcomingEvents : pastEvents;
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
        if (isUpcomingShown) {
          setUpcomingEvents([...currentEvents, ...(fetchedEvents || [])]);
        } else {
          setPastEvents([...currentEvents, ...(fetchedEvents || [])]);
        }
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
  }, [totalCount, page, isUpcomingShown,
    upcomingEvents, pastEvents, isFetchedFirstTime,
    userType, selectedTab.name, showFailure, t]);

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

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
    return (
      <EventItem event={item} activeTab={selectedTab.name} />
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

        {!!(isUpcomingShown ? upcomingEvents : pastEvents).length && (
          <FlatList
            ref={listRef}
            data={isUpcomingShown ? upcomingEvents : pastEvents}
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

        {isFetchedFirstTime && !(isUpcomingShown ? upcomingEvents : pastEvents).length && (
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
