import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { View, ActivityIndicator, useWindowDimensions,
  TouchableOpacity, TouchableWithoutFeedback, Animated, StatusBar } from 'react-native';

import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

import config from 'resources/config';

import CloseWithBackgroundIcon from 'assets/icons/close-with-background.svg';

import Header from 'components/Header';
import Text from 'components/Text';

import colors from 'themes/colors';

import useHorizontalModeHeader from './hooks/useHorizontaModeHeader';
import useOrientation from './hooks/useOrientation';
import useStreamLink from './hooks/useStreamLink';

import styles from './styles';

const initialAnimationValue = -50;

const emptySizeStyles = { height: 0, width: 0 };

const muteSound = (isMuted) => {
  return `
    document.querySelectorAll('video').forEach(audio => {
      audio.muted = ${isMuted};
    });
    true;`;
};

const EventLiveStreamAndroid = ({
  visible,
  eventId,
  eventName,
  eventStreamLink: prefetchedEventStreamLink,
  onClose,
}) => {
  const webViewRef = useRef();
  const animation = useRef(new Animated.Value(initialAnimationValue)).current;

  const [eventStreamLink, setEventStreamLink] = useState(prefetchedEventStreamLink);
  const [isLoading, setIsLoading] = useState(true);

  useOrientation();
  useStreamLink({ eventStreamLink, eventId, setEventStreamLink });

  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      webViewRef.current?.injectJavaScript(muteSound(false));

      Animated.timing(animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIsLoading(false);
      });

      return;
    }

    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(muteSound(true));
    }

    Animated.timing(animation, {
      toValue: initialAnimationValue,
      duration: 10,
      useNativeDriver: true,
    }).start();

    setIsLoading(true);
  }, [animation, visible]);

  const { width, height } = useWindowDimensions();
  const isPortraitOrientation = height > width;

  const liveStreamSource = useMemo(() => (eventStreamLink ? {
    uri: `${config.liveStreamPlayerUrl}/?link=${eventStreamLink}`,
  } : null), [eventStreamLink]);

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
      style={[styles.wrapper, !visible && emptySizeStyles, {
        transform: [{
          translateY: animation,
        }],
      }]}
    >
      {!isPortraitOrientation && visible && <StatusBar hidden />}
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
            style={[styles.webViewPressableContainer, isLoading && emptySizeStyles]}
          >
            <WebView
              ref={webViewRef}
              scrollEnabled={false}
              nestedScrollEnabled={false}
              cacheEnabled={false}
              allowsFullscreenVideo
              style={styles.webView}
              onMessage={onWebViewMessage}
              source={liveStreamSource}
              mediaPlaybackRequiresUserAction={false}
              androidHardwareAccelerationDisabled
              injectedJavaScript={muteSound(true)}
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
