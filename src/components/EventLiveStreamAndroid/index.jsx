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

import useIsConnected from 'hooks/useIsConnected';

import useHorizontalModeHeader from './hooks/useHorizontaModeHeader';
import useOrientation from './hooks/useOrientation';
import useStreamLink from './hooks/useStreamLink';

import styles from './styles';

const initialAnimationValue = -50;

const emptySizeStyles = { height: 0, width: 0 };

const muteSound = (isMuted) => {
  return `
    document.querySelectorAll('video').forEach(video => {
      video.muted = ${isMuted};
    });
    true;`;
};

const pause = () => {
  return `
    document.querySelectorAll('video').forEach(video => {
      video.pause();
    });`;
};

const EventLiveStreamAndroid = ({
  visible,
  eventId,
  eventName,
  eventStreamLink: prefetchedEventStreamLink,
  onClose,
  isPaused,
}) => {
  const webViewRef = useRef();
  const animation = useRef(new Animated.Value(initialAnimationValue)).current;
  const [key, setKey] = useState(1);

  const [eventStreamLink, setEventStreamLink] = useState(prefetchedEventStreamLink);
  const [isLoading, setIsLoading] = useState(true);

  const isConnected = useIsConnected();

  useOrientation();
  useStreamLink({ eventStreamLink, eventId, setEventStreamLink });

  useEffect(() => {
    if (!isConnected) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);
  }, [isConnected]);

  useEffect(() => {
    if (isPaused) {
      webViewRef.current.injectJavaScript(pause());
    }
  }, [isPaused]);

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
    if (msg.nativeEvent.data.includes('consoleError')) {
      setIsLoading(true);

      // Updating key to force webview rerender if an error occured
      setKey(k => k + 1);
    }

    if (msg.nativeEvent.data === 'video_started') {
      prolongControlsShowing();
      setIsLoading(false);
    }
  }, [prolongControlsShowing]);

  const onWebViewError = useCallback(() => {
    // Updating key to force webview rerender if an error occured
    setKey(k => k + 1);
  }, []);


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
              key={key}
              ref={webViewRef}
              scrollEnabled={false}
              nestedScrollEnabled={false}
              cacheEnabled={false}
              allowsFullscreenVideo
              style={styles.webView}
              onMessage={onWebViewMessage}
              source={liveStreamSource}
              mediaPlaybackRequiresUserAction={false}
              androidLayerType={visible ? 'hardware' : 'software'}
              injectedJavaScript={visible ? muteSound(false) : muteSound(true)}
              onError={onWebViewError}
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
  isPaused: PropTypes.bool.isRequired,
};

export default React.memo(EventLiveStreamAndroid);
