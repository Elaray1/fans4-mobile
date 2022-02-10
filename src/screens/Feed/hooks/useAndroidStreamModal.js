import { useCallback, useRef, useState } from 'react';

const useAndroidStreamModal = () => {
  const eventLiveStreamAndroidModalRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  const show = useCallback(() => {
    eventLiveStreamAndroidModalRef.current.show();
    setIsVisible(true);
  }, []);

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    eventLiveStreamAndroidModalRef,
    show,
    onClose,
    isVisible,
  };
};

export default useAndroidStreamModal;
