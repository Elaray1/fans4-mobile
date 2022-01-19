import React, { useCallback, useState, useMemo, useRef, useImperativeHandle } from 'react';
import { View, ActivityIndicator, useWindowDimensions,
  TouchableOpacity, TouchableWithoutFeedback, Animated, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

import config from 'resources/config';

import CloseWithBackgroundIcon from 'assets/icons/close-with-background.svg';

import Header from 'components/Header';
import Text from 'components/Text';

import colors from 'themes/colors';

import useDidUpdate from 'hooks/useDidUpdate';

import useHorizontalModeHeader from './hooks/useHorizontaModeHeader';
import useOrientation from './hooks/useOrientation';
import useStreamLink from './hooks/useStreamLink';
import useUpdateWebviewOnConnectionChanged from './hooks/useUpdateWebviewOnConnectionChanged';
import useVisibilityChanged from './hooks/useVisibilityChanged';

import styles from './styles';
import useIsPaused from './hooks/useIsPaused';
import useGoLiveOnForeground from './hooks/useGoLiveOnForeground';

const muteSound = (isMuted) => {
  return `
    document.querySelectorAll('video').forEach(video => {
      video.muted = ${isMuted};
    });
    true;`;
};

const EventLiveStreamAndroid = React.forwardRef(({
  visible,
  eventId,
  eventName,
  eventStreamLink: prefetchedEventStreamLink,
  onClose,
}, ref) => {
  const webViewRef = useRef();
  const [isLoading, setIsLoading] = useState(true);

  const { eventStreamLink, reloadCurrentStreamLink, fetchStreamLink } = useStreamLink({
    prefetchedEventStreamLink,
    eventId,
    visible,
    setIsLoading,
  });

  const { prolongControlsShowing, isHorizontalModeHeaderShown } = useHorizontalModeHeader();
  const animation = useVisibilityChanged({ visible, webViewRef });

  useIsPaused({ webViewRef });
  useOrientation({ visible });
  useUpdateWebviewOnConnectionChanged({ webViewRef, visible, setIsLoading });
  useGoLiveOnForeground({ webViewRef });

  useImperativeHandle(ref, () => ({
    reloadCurrentStreamLink,
  }));

  useDidUpdate(() => {
    fetchStreamLink();
    webViewRef.current.reload();
  }, [eventId]);

  const { width, height } = useWindowDimensions();
  const isPortraitOrientation = height > width;

  const liveStreamSource = useMemo(() => (eventStreamLink ? {
    uri: `${config.liveStreamPlayerUrl}/?link=${eventStreamLink}`,
  } : null), [eventStreamLink]);

  const onWebViewMessage = useCallback((msg) => {
    console.log('webview message:', msg.nativeEvent.data);

    if (msg.nativeEvent.data.includes('consoleError')) {
      setIsLoading(true);
      webViewRef.current.reload();
    }

    if (msg.nativeEvent.data === 'video_started') {
      prolongControlsShowing();
      setIsLoading(false);

      if (visible) {
        webViewRef.current?.injectJavaScript(muteSound(false));
        return;
      }

      webViewRef.current?.injectJavaScript(muteSound(true));
    }
  }, [prolongControlsShowing, visible]);

  const onWebViewError = useCallback((err) => {
    console.log('webview error:', err);
    setIsLoading(true);
    webViewRef.current.reload();
  }, []);

  return (
    <Animated.View
      style={[styles.container, {
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

      <View style={styles.webViewContainer}>
        {eventStreamLink && (
          <TouchableWithoutFeedback
            onPress={prolongControlsShowing}
            style={styles.webViewPressableContainer}
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
              // using androidLayerType to avoid app crashes when webview isn't visible
              androidLayerType={visible ? 'hardware' : 'software'}
              onError={onWebViewError}
            />
          </TouchableWithoutFeedback>
        )}

        {isLoading && (
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
});

EventLiveStreamAndroid.defaultProps = {
  eventStreamLink: PropTypes.null,
};

EventLiveStreamAndroid.propTypes = {
  visible: PropTypes.bool.isRequired,
  eventId: PropTypes.string.isRequired,
  eventName: PropTypes.string.isRequired,
  eventStreamLink: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default React.memo(EventLiveStreamAndroid);
