import React, {
  useState, useCallback, useEffect, useMemo,
} from 'react';
import {
  SafeAreaView, View, FlatList, ActivityIndicator, Image, TouchableOpacity, ScrollView, RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment-timezone';

import * as eventApi from 'resources/event/event.api';

import Header from 'components/Header';
import Text from 'components/Text';
import Toggle from 'components/Toggle';

import useToast from 'hooks/useToast';

import colors from 'themes/colors';

import { toLocalDateAndTime } from 'helpers/toLocalTime';
import { EVENT_STATUSES } from 'resources/event/event.constants';

import styles from './styles';

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

  const toggleItems = useMemo(() => {
    return [
      {
        id: '1',
        value: t('Events.upcoming'),
        eventTypes: [EVENT_STATUSES.UPCOMING, EVENT_STATUSES.CANCELED],
        emptyView: {
          title: t('Events.noEventsYet'),
          text: t('Events.onceEventsAreScheduledYouWillSeeThemHere'),
        },
      },
      {
        id: '2',
        value: t('Events.past'),
        eventTypes: [EVENT_STATUSES.PAST],
        emptyView: {
          title: t('Events.noEventsYet'),
          text: t('Events.onceYouParticipateInAnEventItWillBeShownOnThisPage'),
        },
      },
    ];
  }, [t]);

  const [selectedToggleItem, setSelectedToggleItem] = useState(toggleItems[0]);

  const EmptyView = () => (
    <View style={styles.emptyView}>
      <View style={styles.illustration} />
      <Text style={styles.titleText}>{selectedToggleItem.emptyView.title}</Text>
      <Text style={styles.text}>{selectedToggleItem.emptyView.text}</Text>
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
          page: fetchingPage,
          perPage: PER_PAGE_COUNT,
          eventTypes: eventTypes || selectedToggleItem.eventTypes,
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
  }, [events, page, totalCount, showFailure, t, selectedToggleItem.eventTypes]);

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
  }, []);

  const onEventPress = useCallback((event) => {
    navigation.navigate('EventFights', { eventId: event._id, title: event.name });
  }, [navigation]);

  const keyExtractor = useCallback(item => item._id, []);

  const renderItem = ({ item }) => {
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
    setSelectedToggleItem(item);
    await fetchNewItems({ refresh: true, eventTypes: item.eventTypes });
  }, [fetchNewItems]);

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={t('Events.events')}
      />
      <View style={styles.content}>
        <Toggle items={toggleItems} onSelect={onToggleSelect} selectedItemId={selectedToggleItem.id} />
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
            contentContainerStyle={{ flexGrow: 1 }}
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
