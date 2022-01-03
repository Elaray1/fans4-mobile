import { useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';

const useOrientation = ({ isFullScreen }) => {
  useEffect(() => {
    if (isFullScreen) {
      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToPortrait();
    }

    return () => Orientation.lockToPortrait();
  }, [isFullScreen]);
};

export default useOrientation;
