import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

const _pause = () => {
  return `
    window.dispatchEvent(new CustomEvent('pause_stream'));
  `;
};

const useIsPaused = ({ webViewRef }) => {
  const [isPaused, setIsPaused] = useState();

  const pause = useCallback(() => {
    webViewRef.current?.injectJavaScript(_pause());
  }, [webViewRef]);

  useEffect(() => {
    AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        setIsPaused(true);
        return;
      }

      setIsPaused(false);
    });
  }, []);


  useEffect(() => {
    if (isPaused) {
      pause();
    }
  }, [pause, isPaused, webViewRef]);

  return pause;
};

export default useIsPaused;
