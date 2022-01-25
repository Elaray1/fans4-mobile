import React, { useCallback, useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, ActivityIndicator, TouchableOpacity,
  Platform, Alert, Modal } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import LiveIcon from 'assets/icons/live.svg';
import PlayIcon from 'assets/icons/play-mini.svg';

import * as userSelectors from 'resources/user/user.selectors';

import * as eventApi from 'resources/event/event.api';

import FlatList from 'components/FlatList';
import Header from 'components/Header';
import FightItem from 'components/FightItem';
import Text from 'components/Text';
import EventLiveStreamAndroidModal from 'components/EventLiveStreamAndroid';
import FullScreenLoader from 'components/FullScreenLoader';
import { FIGHT_VIEW_TYPE } from 'components/FightItem/constants';
import CountdownTimer from 'components/CountdownTimer';
import LiveStreamPlayerIos from 'components/LiveStreamPlayerIos';

import colors from 'themes/colors';

import { EVENT_STATUSES, LIVE_STREAM_STATUSES } from 'resources/event/event.constants';
import { FIGHT_STATUSES } from 'resources/fight/fight.constants';
import { USER_TYPES } from 'resources/user/user.constants';

import { toLocalDateAndTime } from 'helpers/toLocalTime';

import styles from './styles';

import EmptyView from './components/EmptyView';
import LiveStreamBar from './components/LiveStreamBar';

import useAnalytics from './hooks/useAnalytics';
import useFetchItems from './hooks/useFetchItems';
import usePrefetchStreamLink from './hooks/usePrefetchStreamLink';
import useEventUpdated from './hooks/useEventUpdated';

import formatDuration from './helpers/formatDuration';

const posterAspectRatio = 16 / 9;
const aspectRatioStyle = { aspectRatio: posterAspectRatio };

function EventFights({ route }) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { event: prefetchedEvent, isNeedToFetchEvent, isOpenStreamModal, goBackWhenStreamFinished } = route?.params;
  const [event, setEvent] = useState(prefetchedEvent);

  const userType = useSelector(userSelectors.getUserType);
  const isFan = userType === USER_TYPES.FAN;

  const isLiveStream = event.liveStream.status === LIVE_STREAM_STATUSES.LIVE;
  const isLive = event.status === EVENT_STATUSES.PAST
    && event.liveStream.status !== LIVE_STREAM_STATUSES.FINISHED
    && event.liveStream.status !== LIVE_STREAM_STATUSES.PROCESSING;
  const isUpcoming = event.status === EVENT_STATUSES.UPCOMING;
  const isLiveStreamProcessing = event.liveStream.status === LIVE_STREAM_STATUSES.PROCESSING;
  const isLiveStreamFinished = event.liveStream.status === LIVE_STREAM_STATUSES.FINISHED;

  const streamVideoRefIos = useRef(null);
  const [isLiveStreamLoadingIos, setIsLiveStreamLoadingIos] = useState(isLiveStream && Platform.OS === 'ios');
  const [isLiveStreamShownIos, setIsLiveStreamShownIos] = useState(false);

  const [eventStreamLink, setEventStreamLink] = useState(null);

  const [isCountdownTimerModalVisible, setIsCountdownTimerModalVisible] = useState(false);
  const [isAndroidStreamModalVisible, setIsAndroidStreamModalVisible] = useState(!!isOpenStreamModal);
  const liveStreamAndroidModalRef = useRef();

  const [isOpenStreamModalNeeded, setIsOpenStreamModalNeeded] = useState(isOpenStreamModal);
  const [isFullScreenLoader, setIsFullScreenLoader] = useState(false);

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

  const onCloseStream = useCallback(() => {
    streamVideoRefIos.current.closeFullScreen();

    if (goBackWhenStreamFinished) {
      navigation.goBack();
    }
  }, [navigation, goBackWhenStreamFinished]);

  const closeStreamAlert = useCallback(() => {
    Alert.alert(
      t('EventFights.liveStreamHasEnded'),
      t('EventFights.videoWillBeAvailableSoon'),
      [
        {
          text: t('EventFights.ok'),
          onPress: onCloseStream,
        }],
    );
  }, [onCloseStream, t]);

  const {
    fights,
    isLoading,
    isRefreshing,
    onRefresh,
    fetchNewItems,
  } = useFetchItems({ eventId: event._id });

  const onEventUpdated = useCallback((updatedEvent) => {
    const isLiveUpdatedEventStream = updatedEvent.liveStream.status === LIVE_STREAM_STATUSES.LIVE;
    // Show live stream if countdown timer modal was opened
    if (isLiveUpdatedEventStream && !isLiveStream) {
      if (Platform.OS === 'ios') {
        setIsLiveStreamLoadingIos(true);
        streamVideoRefIos.current.reload();
      }

      if (Platform.OS === 'android') {
        liveStreamAndroidModalRef.current?.reloadCurrentStreamLink();

        if (isCountdownTimerModalVisible) {
          setIsCountdownTimerModalVisible(false);
          setIsAndroidStreamModalVisible(true);
        }
      }
    }

    // Live stream finished (IOS)
    if (updatedEvent.liveStream.status === LIVE_STREAM_STATUSES.FINISHED
      && event.liveStream.status === LIVE_STREAM_STATUSES.LIVE
      && isLiveStreamShownIos) {
      closeStreamAlert();
    }


    setEvent(updatedEvent);
    onRefresh();
  }, [onRefresh, isLiveStream, closeStreamAlert,
    isLiveStreamShownIos, event.liveStream.status, isCountdownTimerModalVisible]);

  useAnalytics({ isFan, eventId: event._id });
  useEventUpdated({ eventId: event._id, onEventUpdated });
  usePrefetchStreamLink({ eventId: event._id, setEventStreamLink, streamStatus: event.liveStream.status });


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
    if (isLiveStream || Platform.OS === 'android') {
      onShowLiveStream();
      return;
    }

    if ([EVENT_STATUSES.UPCOMING, EVENT_STATUSES.PAST].includes(event.status)) {
      onOpenCountdownTimer();
    }
  }, [onShowLiveStream, onOpenCountdownTimer,
    isLiveStream, event.status]);

  const onCloseAndroidStreamModal = useCallback(() => {
    setIsAndroidStreamModalVisible(false);
  }, []);

  const onReadyToPlayIos = useCallback(() => {
    setIsLiveStreamLoadingIos(false);

    if (isCountdownTimerModalVisible) {
      setIsCountdownTimerModalVisible(false);
      setIsFullScreenLoader(true);
      // Using setTimeout to open stream modal after closing countdown modal
      setTimeout(() => {
        onShowLiveStream();
      }, 0);
    }
  }, [onShowLiveStream, isCountdownTimerModalVisible]);

  const onFullscreenOpened = useCallback(() => {
    setIsFullScreenLoader(false);
  }, []);

  useEffect(() => {
    if (isOpenStreamModalNeeded && isLiveStream && !isLiveStreamLoadingIos) {
      onShowLiveStream();
      setIsOpenStreamModalNeeded(false);
    }
  }, [isOpenStreamModalNeeded, onShowLiveStream, isLiveStream, isLiveStreamLoadingIos]);

  return (
    <>
      {Platform.OS === 'ios' && (
        <Modal
          visible={isCountdownTimerModalVisible}
          animationType="slide"
          onRequestClose={onCloseCountTimerModal}
        >
          <CountdownTimer
            eventImageUrl={event.imageUrl}
            eventName={event.name}
            eventDate={event.date}
            eventTimezone={event.location.timezone}
            onClose={onCloseCountTimerModal}
          />
        </Modal>
      )}

      {Platform.OS === 'ios' && isFullScreenLoader && <FullScreenLoader />}

      {Platform.OS === 'android' && (
        <EventLiveStreamAndroidModal
          ref={liveStreamAndroidModalRef}
          visible={isAndroidStreamModalVisible}
          eventId={event._id}
          eventImageUrl={event.imageUrl}
          eventName={event.name}
          eventDate={event.date}
          eventTimezone={event.location.timezone}
          eventStreamLink={eventStreamLink}
          onClose={onCloseAndroidStreamModal}
          isCountdownShown={event.liveStream.status === LIVE_STREAM_STATUSES.PENDING}
          onCloseCountdown={onCloseAndroidStreamModal}
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
              disabled={isLiveStreamLoadingIos || isLiveStreamFinished}
            >
              <FastImage style={[styles.photoImage, aspectRatioStyle]} source={{ uri: event.imageUrl }} />

              {Platform.OS === 'ios' && (
                <LiveStreamPlayerIos
                  ref={streamVideoRefIos}
                  eventId={event._id}
                  onExitFullScreen={onExitFullScreenIos}
                  onReadyToPlay={onReadyToPlayIos}
                  onFullscreenOpened={onFullscreenOpened}
                  isLiveStream={isLiveStream}
                />
              )}

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

              {isUpcoming && (
                <View style={styles.posterLabel}>
                  <LiveIcon />

                  <Text style={styles.posterLabelText}>
                    {`${t('Events.liveOn')} ${toLocalDateAndTime(event)} `}
                    {`${event.location.cityName}, ${event.location.stateCode}`}
                  </Text>
                </View>
              )}

              {isLiveStreamProcessing && (
                <View style={[styles.posterLabel, styles.streamFinished]}>
                  <Text style={styles.posterLabelText}>{t('Events.videoWillBeAvailableSoon')}</Text>
                </View>
              )}

              {isLiveStreamFinished && (
                <View style={[styles.posterLabel, styles.streamFinished]}>
                  <PlayIcon />
                  <Text style={styles.posterLabelText}>{eventStreamLink
                    ? formatDuration(event.liveStream.duration)
                    // TODO: add loader or smthing else
                    : '00:00'}
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
      goBackWhenStreamFinished: PropTypes.bool,
    }),
  }).isRequired,
};

export default React.memo(EventFights);
