import { useCallback, useState } from 'react';

const useEventLiveStreamAndroid = () => {
  const [isAndroidStreamModalVisible, setIsAndroidStreamModalVisible] = useState(false);

  const onCloseAndroidStreamModal = useCallback(() => {
    setIsAndroidStreamModalVisible(false);
  }, []);

  return {
    isAndroidStreamModalVisible,
    onCloseAndroidStreamModal,
    setIsAndroidStreamModalVisible,
  };
};

export default useEventLiveStreamAndroid;
