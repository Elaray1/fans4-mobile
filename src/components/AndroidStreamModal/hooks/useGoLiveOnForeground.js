import { useEffect } from 'react';

import { AppState } from 'react-native';

const goLive = () => {
  return `
    const event = new CustomEvent('go_to_live');
    window.dispatchEvent(event);`;
};

const useGoLiveOnForeground = ({ webViewRef }) => {
  useEffect(() => {
    AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        webViewRef.current.injectJavaScript(goLive());
      }
    });
  }, [webViewRef]);
};


export default useGoLiveOnForeground;
