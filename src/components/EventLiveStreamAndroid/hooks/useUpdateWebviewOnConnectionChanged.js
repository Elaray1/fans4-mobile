import { useEffect } from 'react';

import useIsConnected from 'hooks/useIsConnected';
import useDidUpdate from 'hooks/useDidUpdate';

const muteSound = (isMuted) => {
  return `
    document.querySelectorAll('video').forEach(video => {
      video.muted = ${isMuted};
    });
    true;`;
};

const useUpdateWebviewOnConnectionChanged = ({ webViewRef, setIsLoading, visible }) => {
  const isConnected = useIsConnected();

  useDidUpdate(() => {
    if (!isConnected) {
      webViewRef.current?.injectJavaScript(muteSound(true));
      setIsLoading(true);
    }

    webViewRef.current?.reload();
  }, [isConnected, setIsLoading, webViewRef]);


  useEffect(() => {
    if (visible) {
      webViewRef.current?.injectJavaScript(muteSound(false));
    }
  }, [visible, webViewRef]);
};

export default useUpdateWebviewOnConnectionChanged;
