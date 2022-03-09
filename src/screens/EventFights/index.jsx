import React, { useCallback, useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, ActivityIndicator, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';

import LiveIcon from 'assets/icons/live.svg';
import PlayIcon from 'assets/icons/play-mini.svg';

import * as userSelectors from 'resources/user/user.selectors';
import { USER_TYPES } from 'resources/user/user.constants';
import * as eventApi from 'resources/event/event.api';
import { EVENT_STATUSES, LIVE_STREAM_STATUSES } from 'resources/event/event.constants';
import { FIGHT_STATUSES } from 'resources/fight/fight.constants';

import FlatList from 'components/FlatList';
import Header from 'components/Header';
import FightItem from 'components/FightItem';
import Text from 'components/Text';
import AndroidStreamModal from 'components/AndroidStreamModal';
import FullScreenLoader from 'components/FullScreenLoader';
import { FIGHT_VIEW_TYPE } from 'components/FightItem/constants';
import CountdownTimer from 'components/CountdownTimer';
import LiveStreamPlayerIos from 'components/LiveStreamPlayerIos';

import colors from 'themes/colors';

import { toLocalDateAndTime } from 'helpers/toLocalTime';

import useEventUpdated from 'hooks/useEventUpdated';
import useDidUpdate from 'hooks/useDidUpdate';

import styles from './styles';

import EmptyView from './components/EmptyView';
import LiveStreamBar from './components/LiveStreamBar';
import FinishedStreamVideo from './components/FinishedStreamVideo';

import useAnalytics from './hooks/useAnalytics';
import useFetchItems from './hooks/useFetchItems';

import formatDuration from './helpers/formatDuration';

const posterAspectRatio = 16 / 9;
const aspectRatioStyle = { aspectRatio: posterAspectRatio };

function EventFights({ route }) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { event: prefetchedEvent, isNeedToFetchEvent, isOpenStreamModal } = route?.params;
  const [event, setEvent] = useState(prefetchedEvent);

  const userType = useSelector(userSelectors.getUserType);
  const isPaidSubscription = useSelector(userSelectors.getIsPaidSubscription);
  const isFan = userType === USER_TYPES.FAN;

  const isLiveStream = event.liveStream.status === LIVE_STREAM_STATUSES.LIVE;
  const isLive = event.status === EVENT_STATUSES.PAST
    && event.liveStream.status !== LIVE_STREAM_STATUSES.FINISHED
    && event.liveStream.status !== LIVE_STREAM_STATUSES.PROCESSING;
  const isUpcoming = event.status === EVENT_STATUSES.UPCOMING;
  const isLiveStreamProcessing = event.liveStream.status === LIVE_STREAM_STATUSES.PROCESSING;
  const isLiveStreamFinished = event.liveStream.status === LIVE_STREAM_STATUSES.FINISHED;

  const finishedStreamVideoRef = useRef();
  const [playFinishedStreamWhenReady, setPlayFinishedStreamWhenReady] = useState(false);
  const [isFinishedStreamReadyToPlay, setIsFinishedStreamReadyToPlay] = useState(false);
  const onReadyToPlayFinishedStream = useCallback(() => {
    setIsFinishedStreamReadyToPlay(true);

    if (playFinishedStreamWhenReady) {
      finishedStreamVideoRef.current.showFullScreen();
    }
  }, [playFinishedStreamWhenReady]);

  const streamVideoRefIos = useRef(null);
  const [isLiveStreamLoadingIos, setIsLiveStreamLoadingIos] = useState(isPaidSubscription
    && isLiveStream
    && Platform.OS === 'ios');

  const [isCountdownTimerModalVisible, setIsCountdownTimerModalVisible] = useState(false);
  const liveStreamAndroidModalRef = useRef();

  const [isOpenStreamModalNeeded, setIsOpenStreamModalNeeded] = useState(isOpenStreamModal);
  const [isFullScreenLoader, setIsFullScreenLoader] = useState(false);

  const showSubscriptionAlert = useCallback(() => {
    const alertDescription = event.liveStream.status === LIVE_STREAM_STATUSES.FINISHED
      ? t('BecomeFanAlert.finishedStreamDescription')
      : t('BecomeFanAlert.liveStreamDescription');

    const alertOptions = [
      { text: t('BecomeFanAlert.ok') },
    ];

    if (Platform.OS === 'ios') {
      alertOptions.push({
        text: t('BecomeFanAlert.chooseFighter'),
        onPress: () => navigation.navigate('SearchFighters'),
      });
    }

    Alert.alert(t('BecomeFanAlert.title'), alertDescription, alertOptions);
  }, [event.liveStream.status, navigation, t]);

  const onShowLiveStream = useCallback(() => {
    if (Platform.OS === 'ios') {
      streamVideoRefIos.current.showFullScreen();

      return;
    }

    liveStreamAndroidModalRef.current.show();
  }, []);

  useDidUpdate(() => {
    if (isPaidSubscription && Platform.OS === 'ios') {
      setIsLiveStreamLoadingIos(true);
    }
  }, [isPaidSubscription]);

  useEffect(() => {
    if (isOpenStreamModalNeeded && isFan && !isPaidSubscription) {
      showSubscriptionAlert();
      setIsOpenStreamModalNeeded(false);
    }
  }, [isFan, isPaidSubscription, showSubscriptionAlert, isOpenStreamModalNeeded]);

  useEffect(() => {
    async function init() {
      if ((!isFan || isPaidSubscription) && isOpenStreamModalNeeded) {
        if (Platform.OS === 'ios') {
          streamVideoRefIos.current?.showFullScreen();
        } else {
          liveStreamAndroidModalRef.current?.show();
        }
        setIsOpenStreamModalNeeded(false);
      }
    }
    init();
  }, [showSubscriptionAlert, isPaidSubscription, isFan, isOpenStreamModalNeeded]);

  useEffect(() => {
    if ((!isFan || isPaidSubscription) && isOpenStreamModalNeeded && isLiveStream && !isLiveStreamLoadingIos) {
      onShowLiveStream();
      setIsOpenStreamModalNeeded(false);
    }
  }, [
    isOpenStreamModalNeeded,
    onShowLiveStream,
    isLiveStream,
    isLiveStreamLoadingIos,
    isFan,
    isPaidSubscription,
  ]);

  useEffect(() => {
    const updateEventData = async () => {
      const updatedEvent = await eventApi.getEvent(prefetchedEvent._id);
      setEvent(updatedEvent);
    };

    if (isNeedToFetchEvent) {
      updateEventData();

      if (Platform.OS === 'android') {
        liveStreamAndroidModalRef?.current?.loadEvent();
        return;
      }

      streamVideoRefIos?.current?.reload();
    }
  }, [isNeedToFetchEvent, prefetchedEvent._id]);

  const {
    fights,
    isLoading,
    isRefreshing,
    onRefresh,
    fetchNewItems,
  } = useFetchItems({ eventId: event._id });

  const onEventUpdated = useCallback((updatedEvent) => {
    const didBecomeLive = updatedEvent.liveStream.status === LIVE_STREAM_STATUSES.LIVE && !isLiveStream;

    if (didBecomeLive) {
      if (Platform.OS === 'ios') {
        setIsLiveStreamLoadingIos(true);
        streamVideoRefIos?.current?.reload();
      }
    }

    setEvent(updatedEvent);
    onRefresh();
  }, [onRefresh, isLiveStream]);

  useAnalytics({ isFan, eventId: event._id });
  useEventUpdated({ eventId: event._id, onEventUpdated });

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

    const isStayTunedShown = item._id === fights[indexOfFightWithoutResults]?._id;

    return (
      <>
        {isLive && isStayTunedShown && <Text style={styles.stayTuned}>{t('Events.stayTuned')}</Text>}
        <FightItem
          fight={item}
          isCountdownShown
          viewType={item.status === FIGHT_STATUSES.PAST ? FIGHT_VIEW_TYPE.EVENT_PAST : FIGHT_VIEW_TYPE.EVENT_UPCOMING}
        />
      </>
    );
  };

  const openCountdownTimer = useCallback(() => {
    setIsCountdownTimerModalVisible(true);
  }, []);

  const onCloseCountTimerModal = useCallback(() => {
    setIsCountdownTimerModalVisible(false);
  }, []);

  const onPressEventPoster = useCallback(() => {
    if (isFan && !isPaidSubscription) {
      showSubscriptionAlert();
      return;
    }

    if (event.liveStream.status !== LIVE_STREAM_STATUSES.FINISHED && (isLiveStream || Platform.OS === 'android')) {
      onShowLiveStream();
      return;
    }

    const isNotLiveYet = event.status === EVENT_STATUSES.UPCOMING
      || event.liveStream.status === LIVE_STREAM_STATUSES.PENDING;

    if (isNotLiveYet) {
      openCountdownTimer();
      return;
    }

    if (event.liveStream.status === LIVE_STREAM_STATUSES.FINISHED) {
      if (isFinishedStreamReadyToPlay || Platform.OS === 'android') {
        finishedStreamVideoRef.current.showFullScreen();
      } else {
        setPlayFinishedStreamWhenReady(true);
      }
    }
  }, [onShowLiveStream, openCountdownTimer,
    isLiveStream, event.status, event.liveStream.status, isFinishedStreamReadyToPlay,
    isFan, isPaidSubscription, showSubscriptionAlert,
  ]);

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

  const PosterLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <>
      {(!isFan || isPaidSubscription) && (
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
                eventLiveStreamStatus={event.liveStream.status}
              />
            </Modal>
          )}

          {Platform.OS === 'ios' && isFullScreenLoader && <FullScreenLoader />}

          {Platform.OS === 'android' && (
            <AndroidStreamModal
              ref={liveStreamAndroidModalRef}
              eventId={event._id}
              eventImageUrl={event.imageUrl}
              eventName={event.name}
              eventDate={event.date}
              eventTimezone={event.location.timezone}
              eventLiveStreamStatus={event.liveStream.status}
            />
          )}

          {Platform.OS === 'ios' && (
            <LiveStreamPlayerIos
              ref={streamVideoRefIos}
              eventId={event._id}
              onReadyToPlay={onReadyToPlayIos}
              onFullscreenOpened={onFullscreenOpened}
              isLiveStream={isLiveStream}
              eventLiveStreamStatus={event.liveStream.status}
            />
          )}

          {event.liveStream.status === LIVE_STREAM_STATUSES.FINISHED && (
            <FinishedStreamVideo
              ref={finishedStreamVideoRef}
              eventId={event._id}
              width={event.liveStream.width}
              height={event.liveStream.height}
              duration={event.liveStream.duration}
              onReadyToPlay={onReadyToPlayFinishedStream}
            />
          )}
        </>
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
              disabled={isLiveStreamLoadingIos || isLiveStreamProcessing}
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
                  <Text style={styles.posterLabelText}>{formatDuration(event.liveStream.duration)}
                  </Text>
                </View>
              )}

              {(isLiveStreamLoadingIos
              || (playFinishedStreamWhenReady && !isFinishedStreamReadyToPlay))
                && <PosterLoader />}
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

          {!isLoading && event.status !== EVENT_STATUSES.CANCELLED
          && event.status !== EVENT_STATUSES.PAST && !fights.length && (
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
