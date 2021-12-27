import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, View, FlatList, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';

import LiveIcon from 'assets/icons/live.svg';

import * as userSelectors from 'resources/user/user.selectors';

import Header from 'components/Header';
import FightItem from 'components/FightItem';
import Text from 'components/Text';

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

import useAnalytics from './hooks/useAnalytics';
import useFetchItems from './hooks/useFetchItems';
import usePrefetchStreamLinkAndroid from './hooks/usePrefetchStreamLinkAndroid';

const posterAspectRatio = 16 / 9;
const aspectRatioStyle = { aspectRatio: posterAspectRatio };

function EventFights({ route }) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { event } = route?.params;

  const userType = useSelector(userSelectors.getUserType);
  const isFan = userType === USER_TYPES.FAN;
  const isUpcoming = event.status === EVENT_STATUSES.UPCOMING;

  const isLiveStream = event.liveStream.status === LIVE_STREAM_STATUSES.LIVE;
  const isLive = event.status === EVENT_STATUSES.PAST && event.liveStream.status !== LIVE_STREAM_STATUSES.FINISHED;

  const streamVideoRefIos = useRef(null);
  const [isLiveStreamLoadingIos, setIsLiveStreamLoadingIos] = useState(isLiveStream && Platform.OS === 'ios');
  const [isLiveStreamShownIos, setIsLiveStreamShownIos] = useState(false);

  const [eventStreamLink, setEventStreamLink] = useState(null);

  const onReadyToPlayIos = useCallback(() => {
    setIsLiveStreamLoadingIos(false);
  }, []);

  const onExitFullScreenIos = useCallback(() => {
    setIsLiveStreamShownIos(false);
  }, []);

  useAnalytics({ isFan, eventId: event._id });

  const {
    fights,
    isLoading,
    isRefreshing,
    onRefresh,
    fetchNewItems,
  } = useFetchItems({ eventId: event._id });

  usePrefetchStreamLinkAndroid({ eventId: event._id, setEventStreamLink });

  const onShowLiveStream = useCallback(() => {
    if (Platform.OS === 'ios') {
      setIsLiveStreamShownIos(true);
      streamVideoRefIos.current.showFullScreen();

      return;
    }

    navigation.navigate('EventLiveStreamAndroid', {
      eventId: event._id,
      eventName: event.name,
      eventStreamLink,
    });
  }, [navigation, event.name, event._id, eventStreamLink]);

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

  return (
    <SafeAreaView style={styles.screen}>
      <Header
        title={event.name}
        leftItemType="backArrow"
      />

      <View style={styles.content}>
        <View style={styles.event}>
          <TouchableOpacity
            style={[styles.eventImageContainer, aspectRatioStyle]}
            onPress={isLiveStream && !isLiveStreamLoadingIos ? onShowLiveStream : undefined}
          >
            <FastImage style={[styles.photoImage, aspectRatioStyle]} source={{ uri: event.imageUrl }} />

            {event.status === EVENT_STATUSES.CANCELED && moment().isBefore(event.date) && (
              <View style={styles.imageStatus}>
                <Text style={styles.imageText}>{t('Events.canceled')}</Text>
              </View>
            )}

            {isLive && (
              <LiveStreamBar
                fightsWithResultsCount={event.fights.filter(fight => fight.results !== undefined).length}
                fightsCount={event.fights.length}
              />
            )}

            {isLiveStream && (
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

        {!isLoading && !fights.length && <EmptyView isFan isRefreshing onRefresh={onRefresh} />}
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
