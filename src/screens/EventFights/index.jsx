import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';

import LiveIcon from 'assets/icons/live.svg';

import * as userSelectors from 'resources/user/user.selectors';

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

  const { event: prefetchedEvent } = route?.params;
  const [event, setEvent] = useState(prefetchedEvent);

  const userType = useSelector(userSelectors.getUserType);
  const isFan = userType === USER_TYPES.FAN;
  const isUpcoming = event.status === EVENT_STATUSES.UPCOMING;

  const isLiveStream = event.liveStream.status === LIVE_STREAM_STATUSES.LIVE;
  const isLive = event.status === EVENT_STATUSES.PAST && event.liveStream.status !== LIVE_STREAM_STATUSES.FINISHED;

  const streamVideoRefIos = useRef(null);
  const [isLiveStreamLoadingIos, setIsLiveStreamLoadingIos] = useState(isLiveStream && Platform.OS === 'ios');
  const [isLiveStreamShownIos, setIsLiveStreamShownIos] = useState(false);

  const [eventStreamLink, setEventStreamLink] = useState(null);

  const [isCountdownTimerModalVisible, setIsCountdownTimerModalVisible] = useState(false);
  const [isAndroidStreamModalVisible, setIsAndroidStreamModalVisible] = useState(false);

  const onReadyToPlayIos = useCallback(() => {
    setIsLiveStreamLoadingIos(false);
  }, []);

  const onExitFullScreenIos = useCallback(() => {
    setIsLiveStreamShownIos(false);
  }, []);

  useAnalytics({ isFan, eventId: event._id });
  useEventUpdated({ eventId: event._id, onEventUpdated: setEvent });
  usePrefetchStreamLinkAndroid({ eventId: event._id, setEventStreamLink, streamStatus: event.liveStream.status });

  const {
    fights,
    isLoading,
    isRefreshing,
    onRefresh,
    fetchNewItems,
  } = useFetchItems({ eventId: event._id });


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

  return (
    <>
      <CountdownTimer
        visible={isCountdownTimerModalVisible}
        event={event}
        onClose={onCloseCountTimerModal}
      />
      {Platform.OS === 'android' && eventStreamLink
      && (
      <EventLiveStreamAndroidModal
        visible={isAndroidStreamModalVisible}
        eventId={event._id}
        eventName={event.name}
        eventStreamLink={eventStreamLink}
        onClose={onCloseAndroidStreamModal}
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
              />
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
    }),
  }).isRequired,
};

export default React.memo(EventFights);
