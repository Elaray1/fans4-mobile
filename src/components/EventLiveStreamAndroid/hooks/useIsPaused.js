import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const pause = () => {
  return `
    const event = new CustomEvent('pause_stream');
    window.dispatchEvent(event);
  `;
};

const useIsPaused = ({ webViewRef }) => {
  const [isPaused, setIsPaused] = useState();

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
      webViewRef.current.injectJavaScript(pause());
    }
  }, [isPaused, webViewRef]);

  return pause;
};

export default useIsPaused;
