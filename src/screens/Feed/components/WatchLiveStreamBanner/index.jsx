import React, { useMemo, useCallback, useState, useRef } from 'react';
import { TouchableOpacity, View, Platform, ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';

import LiveIcon from 'assets/icons/live.svg';

import Text from 'components/Text';
import LiveStreamPlayerIos from 'components/LiveStreamPlayerIos';

import useDidUpdate from 'hooks/useDidUpdate';

import { LIVE_STREAM_STATUSES } from 'resources/event/event.constants';
import * as userSelectors from 'resources/user/user.selectors';

import colors from 'themes/colors';

import styles from './styles';

const WatchLiveStreamBanner = ({ event, onPress }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const isPaidSubscription = useSelector(userSelectors.getIsPaidSubscription);

  const posterSource = useMemo(() => {
    return { uri: event.imageUrl };
  }, [event.imageUrl]);

  const [isStreamLoading, setIsStreamLoading] = useState(Platform.OS === 'ios' && isPaidSubscription);
  const streamVideoRefIos = useRef();

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

  const onContainerPress = useCallback(() => {
    if (!isPaidSubscription) {
      showSubscriptionAlert();
      return;
    }

    if (onPress) {
      onPress(event);
    }

    if (!isStreamLoading && Platform.OS === 'ios') {
      streamVideoRefIos.current.showFullScreen();
    }
  }, [onPress, event, isStreamLoading, showSubscriptionAlert, isPaidSubscription]);

  // hidding banner before load first chunk is implemented only for ios
  const [wasWaitedForPreloadStream, setWasWaitedForPreloadStream] = useState(Platform.OS === 'android');

  const onReadyToPlayIos = useCallback(() => {
    setIsStreamLoading(false);
    setWasWaitedForPreloadStream(true);
  }, []);

  const isLive = event.liveStream.status === LIVE_STREAM_STATUSES.LIVE;
  const isFullScreenOpenedIosRef = useRef(false);

  const onFullscreenOpenedIos = useCallback(() => {
    isFullScreenOpenedIosRef.current = true;
  }, []);

  const onExitFullScreenIos = useCallback(() => {
    isFullScreenOpenedIosRef.current = false;
  }, []);

  useDidUpdate(() => {
    if (!isFullScreenOpenedIosRef.current && isLive && Platform.OS === 'ios') {
      setIsStreamLoading(true);
      streamVideoRefIos.current.reload();
      setWasWaitedForPreloadStream(false);
    }
  }, [isLive]);

  return (
    <TouchableOpacity
      onPress={onContainerPress}
      style={(isLive && (wasWaitedForPreloadStream || !isPaidSubscription))
        ? styles.container
        : styles.hiddenContainer}
    >
      <View>
        {isPaidSubscription && Platform.OS === 'ios' && (
          <LiveStreamPlayerIos
            ref={streamVideoRefIos}
            eventId={event._id}
            onReadyToPlay={onReadyToPlayIos}
            eventLiveStreamStatus={event.liveStream.status}
            onExitFullScreen={onExitFullScreenIos}
            onFullscreenOpened={onFullscreenOpenedIos}
          />
        )}

        <FastImage style={styles.poster} source={posterSource} />

        <View style={styles.live}>
          <LiveIcon />
          <Text>{t('WatchLiveStreamBanner.live')}</Text>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.isLiveText}>{event.name} {t('WatchLiveStreamBanner.isLive')}</Text>
        <Text style={styles.watchLiveText}>{t('WatchLiveStreamBanner.watchLive')}</Text>
      </View>

      {isStreamLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};

WatchLiveStreamBanner.propTypes = {
  event: PropTypes.shape().isRequired,
  onPress: PropTypes.func,
};

WatchLiveStreamBanner.defaultProps = {
  onPress: undefined,
};

export default React.memo(WatchLiveStreamBanner);
