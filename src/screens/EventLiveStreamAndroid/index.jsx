import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { View, ActivityIndicator, useWindowDimensions,
  TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';

import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import Orientation from 'react-native-orientation-locker';

import * as eventApi from 'resources/event/event.api';
import config from 'resources/config';

import CloseWithBackgroundIcon from 'assets/icons/close-with-background.svg';

import Header from 'components/Header';
import Text from 'components/Text';

import colors from 'themes/colors';

import useHorizontalModeHeader from './hooks/useHorizontaModeHeader';

import styles from './styles';

const initialAnimationValue = -50;

const EventLiveStreamAndroid = ({
  visible,
  eventId,
  eventName,
  eventStreamLink: prefetchedEventStreamLink,
  onClose,
}) => {
  const animation = useRef(new Animated.Value(initialAnimationValue)).current;

  const [eventStreamLink, setEventStreamLink] = useState(prefetchedEventStreamLink);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      Animated.timing(animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsLoading(false);
      });
    } else {
      Animated.timing(animation, {
        toValue: initialAnimationValue,
        duration: 10,
        useNativeDriver: true,
      }).start();
      setIsLoading(true);
    }
  }, [animation, visible]);

  useEffect(() => {
    const getStreamLink = async () => {
      if (!eventStreamLink) {
        const { link } = await eventApi.getStreamLinkByEventId(eventId);
        setEventStreamLink(link);
      }
    };

    getStreamLink();
  }, [eventStreamLink, eventId]);

  useEffect(() => {
    Orientation.unlockAllOrientations();
    return () => Orientation.lockToPortrait();
  }, []);

  const { width, height } = useWindowDimensions();
  const isPortraitOrientation = height > width;

  const liveStreamSource = useMemo(() => ({
    uri: `${config.liveStreamPlayerUrl}/?link=${eventStreamLink}`,
  }), [eventStreamLink]);

  const [isHorizontalModeHeaderShown, setIsHorizontalModeHeaderShown] = useState(true);
  const { prolongControlsShowing } = useHorizontalModeHeader({
    onHorizontalModeHeaderToggled: setIsHorizontalModeHeaderShown,
  });

  const onWebViewMessage = useCallback((msg) => {
    if (msg.nativeEvent.data === 'video_started') {
      prolongControlsShowing();
      setIsLoading(false);
    }
  }, [prolongControlsShowing]);

  return (
    <Animated.View
      style={[styles.wrapper, !visible && { height: 0, width: 0 }, {
        transform: [{
          translateY: animation,
        }],
      }]}
    >
      {isPortraitOrientation && (
      <Header
        title={eventName}
        leftItemType="close"
        onLeftItemPress={onClose}
      />
      )}

      <View style={styles.container}>
        {eventStreamLink && (
        <TouchableWithoutFeedback
          onPress={prolongControlsShowing}
          style={[styles.webViewPressableContainer, isLoading && { width: 0, height: 0 }]}
        >
          <WebView
            scrollEnabled={false}
            nestedScrollEnabled={false}
            cacheEnabled={false}
            allowsFullscreenVideo
            style={styles.webView}
            onMessage={onWebViewMessage}
            source={liveStreamSource}
            mediaPlaybackRequiresUserAction={false}
          />
        </TouchableWithoutFeedback>
        )}

        {(!eventStreamLink || isLoading) && (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
        )}
      </View>

      {!isPortraitOrientation && isHorizontalModeHeaderShown && (
      <View style={styles.horizontalModeHeader}>
        <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
          <CloseWithBackgroundIcon />
        </TouchableOpacity>
        <Text style={styles.horizontalModeTitle}>{eventName}</Text>
      </View>
      )}
    </Animated.View>
  );
};

EventLiveStreamAndroid.propTypes = {
  visible: PropTypes.bool.isRequired,
  eventId: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  eventStreamLink: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default React.memo(EventLiveStreamAndroid);
