import { useEffect } from 'react';

const pause = () => {
  return `
    const event = new CustomEvent('pause_stream');
    window.dispatchEvent(evt);
  `;
};

const useIsPaused = ({ webViewRef, isPaused }) => {
  useEffect(() => {
    if (isPaused) {
      webViewRef.current.injectJavaScript(pause());
    }
  }, [isPaused, webViewRef]);

  return pause;
};

export default useIsPaused;
