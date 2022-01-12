import React, { useCallback, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View, ActivityIndicator, TouchableOpacity, Platform, AppState } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';

import LiveIcon from 'assets/icons/live.svg';

import * as userSelectors from 'resources/user/user.selectors';

import * as eventApi from 'resources/event/event.api';

import FlatList from 'components/FlatList';
import Header from 'components/Header';
import FightItem from 'components/FightItem';
import Text from 'components/Text';
import EventLiveStreamAndroidModal from 'components/EventLiveStreamAndroid';

import colors from 'themes/colors';

import { EVENT_STATUSES, LIVE_STREAM_STATUSES } from 'resources/event/event.constants';
import { FIGHT_STATUSES } from 'resources/fight/fight.constants';
import { USER_TYPES } from 'resources/user/user.constants';
import { FIGHT_VIEW_TYPE } from 'components/FightItem/constants';

import { toLocalDateAndTime } from 'helpers/toLocalTime';

import styles from './styles';

import EmptyView from './components/EmptyView';
import LiveStreamBar from './components/LiveStreamBar';
import LiveStreamPlayerIos from './components/LiveStreamPlayerIos';
import CountdownTimer from './components/CountdownTimer';

import useAnalytics from './hooks/useAnalytics';
import useFetchItems from './hooks/useFetchItems';
import usePrefetchStreamLinkAndroid from './hooks/usePrefetchStreamLinkAndroid';
import useEventUpdated from './hooks/useEventUpdated';

const posterAspectRatio = 16 / 9;
const aspectRatioStyle = { aspectRatio: posterAspectRatio };

function EventFights({ route }) {
  const { t } = useTranslation();

  const { event: prefetchedEvent, isNeedToFetchEvent, isOpenStreamModal } = route?.params;
  const [event, setEvent] = useState(prefetchedEvent);

  const userType = useSelector(userSelectors.getUserType);
  const isFan = userType === USER_TYPES.FAN;
  const isUpcoming = event.status === EVENT_STATUSES.UPCOMING;

  const isLiveStream = event.liveStream.status === LIVE_STREAM_STATUSES.LIVE;
  const isLive = event.status === EVENT_STATUSES.PAST && event.liveStream.status !== LIVE_STREAM_STATUSES.FINISHED;

  const streamVideoRefIos = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiveStreamLoadingIos, setIsLiveStreamLoadingIos] = useState(isLiveStream && Platform.OS === 'ios');
  const [isLiveStreamShownIos, setIsLiveStreamShownIos] = useState(false);

  const [eventStreamLink, setEventStreamLink] = useState(null);

  const [isCountdownTimerModalVisible, setIsCountdownTimerModalVisible] = useState(false);
  const [isAndroidStreamModalVisible, setIsAndroidStreamModalVisible] = useState(false);

  const [isOpenStreamModalNeeded, setIsOpenStreamModalNeeded] = useState(isOpenStreamModal);

  useEffect(() => {
    const updateEventData = async () => {
      const updatedEvent = await eventApi.getEvent(prefetchedEvent._id);
      setEvent(updatedEvent);
    };

    if (isNeedToFetchEvent) {
      updateEventData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onExitFullScreenIos = useCallback(() => {
    setIsLiveStreamShownIos(false);
  }, []);

  const {
    fights,
    isLoading,
    isRefreshing,
    onRefresh,
    fetchNewItems,
  } = useFetchItems({ eventId: event._id });

  const onEventUpdated = useCallback((updatedEvent) => {
    // Show live stream if countdown timer modal was opened
    if (Platform.OS === 'ios') {
      const isLiveUpdatedEventStream = updatedEvent.liveStream.status === LIVE_STREAM_STATUSES.LIVE;

      if (isLiveUpdatedEventStream && !isLiveStream) {
        setIsLiveStreamLoadingIos(true);
      }
    }

    setEvent(updatedEvent);
    onRefresh();
  }, [onRefresh, isLiveStream]);

  useAnalytics({ isFan, eventId: event._id });
  useEventUpdated({ eventId: event._id, onEventUpdated });
  usePrefetchStreamLinkAndroid({ eventId: event._id, setEventStreamLink, streamStatus: event.liveStream.status });


  const onShowLiveStream = useCallback(() => {
    if (Platform.OS === 'ios') {
      setIsLiveStreamShownIos(true);
      streamVideoRefIos.current.showFullScreen();

      return;
    }

    setIsAndroidStreamModalVisible(true);
  }, []);

  const keyExtractor = useCallback(item => item._id, []);

  const Loader = () => <View style={styles.loader}><ActivityIndicator size="large" color={colors.primary} /></View>;

  const renderFooter = () => {
    if (!isLoading) {
      return null;
    }

    return <Loader />;
  };

  const renderItem = ({ item }) => {
    const indexOfFightWithoutResults = fights.map(f => f.results || 0).indexOf(0);

    const isShowText = item._id === fights[indexOfFightWithoutResults]?._id;

    return (
      <>
        {isLive && isShowText && <Text style={styles.stayTuned}>{t('Events.stayTuned')}</Text>}
        <FightItem
          fight={item}
          isCountdownShown
          viewType={item.status === FIGHT_STATUSES.PAST ? FIGHT_VIEW_TYPE.EVENT_PAST : FIGHT_VIEW_TYPE.EVENT_UPCOMING}
        />
      </>
    );
  };

  const onOpenCountdownTimer = useCallback(() => {
    setIsCountdownTimerModalVisible(true);
  }, []);

  const onCloseCountTimerModal = useCallback(() => {
    setIsCountdownTimerModalVisible(false);
  }, []);

  const onPressEventPoster = useCallback(() => {
    if (isLiveStream && !isLiveStreamLoadingIos) {
      onShowLiveStream();
      return;
    }

    if ([EVENT_STATUSES.UPCOMING, EVENT_STATUSES.PAST].includes(event.status)) {
      onOpenCountdownTimer();
    }
  }, [onShowLiveStream, onOpenCountdownTimer,
    isLiveStream, isLiveStreamLoadingIos, event.status]);

  const onCloseAndroidStreamModal = useCallback(() => {
    setIsAndroidStreamModalVisible(false);
  }, []);

  const onReadyToPlayIos = useCallback(() => {
    setIsLiveStreamLoadingIos(false);

    if (isCountdownTimerModalVisible) {
      setIsCountdownTimerModalVisible(false);
      // Using setTimeout to open stream modal after closing countdown modal
      setTimeout(() => {
        onShowLiveStream();
      }, 0);
    }
  }, [onShowLiveStream, isCountdownTimerModalVisible]);

  useEffect(() => {
    if (isOpenStreamModalNeeded && isLiveStream && !isLiveStreamLoadingIos) {
      onShowLiveStream();
      setIsOpenStreamModalNeeded(false);
    }
  }, [isOpenStreamModalNeeded, onShowLiveStream, isLiveStream, isLiveStreamLoadingIos]);

  AppState.addEventListener('change', (state) => {
    if (state !== 'active') {
      setIsPaused(true);
    }
  });

  return (
    <>
      <CountdownTimer
        visible={isCountdownTimerModalVisible}
        event={event}
        onClose={onCloseCountTimerModal}
      />
      {Platform.OS === 'android' && eventStreamLink && (
        <EventLiveStreamAndroidModal
          visible={isAndroidStreamModalVisible}
          eventId={event._id}
          eventName={event.name}
          eventStreamLink={eventStreamLink}
          onClose={onCloseAndroidStreamModal}
          isPaused={isPaused}
        />
      )}
      <SafeAreaView style={styles.screen}>
        <Header
          title={event.name}
          leftItemType="backArrow"
        />

        <View style={styles.content}>
          <View style={styles.event}>
            <TouchableOpacity
              style={[styles.eventImageContainer, aspectRatioStyle]}
              onPress={onPressEventPoster}
            >
              <FastImage style={[styles.photoImage, aspectRatioStyle]} source={{ uri: event.imageUrl }} />

              {event.status === EVENT_STATUSES.CANCELLED && moment().isBefore(event.date) && (
              <View style={styles.imageStatus}>
                <Text style={styles.imageText}>{t('Events.cancelled')}</Text>
              </View>
              )}

              {isLive && (
              <LiveStreamBar
                fightsWithResultsCount={event.fights.filter(fight => fight.results !== undefined).length}
                fightsCount={event.fights.length}
              />
              )}

              {Platform.OS === 'ios' && isLiveStream && (
                <LiveStreamPlayerIos
                  ref={streamVideoRefIos}
                  eventId={event._id}
                  muted={!isLiveStreamShownIos}
                  onExitFullScreen={onExitFullScreenIos}
                  onReadyToPlay={onReadyToPlayIos}
                  isPaused={isPaused}
                />
              )}

              {isUpcoming && (
              <View style={styles.upcoming}>
                <LiveIcon />

                <Text style={styles.upcomingText}>
                  {`${t('Events.liveOn')} ${toLocalDateAndTime(event)} `}
                  {`${event.location.cityName}, ${event.location.stateCode}`}
                </Text>
              </View>
              )}

              {isLiveStreamLoadingIos && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
              )}
            </TouchableOpacity>
          </View>

          {isLoading && <Loader />}

          {!isLoading && !!fights.length && (
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
          {!isLoading
          && event.status !== EVENT_STATUSES.CANCELLED
          && event.status !== EVENT_STATUSES.PAST
          && !fights.length
          && (
            <EmptyView
              isFan={isFan}
              isRefreshing={isRefreshing}
              onRefresh={onRefresh}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

EventFights.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      event: PropTypes.shape().isRequired,
      isNeedToFetchEvent: PropTypes.bool,
      isOpenStreamModal: PropTypes.bool,
    }),
  }).isRequired,
};

export default React.memo(EventFights);
