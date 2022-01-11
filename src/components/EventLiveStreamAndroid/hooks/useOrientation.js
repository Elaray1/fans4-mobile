import { useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';

const useOrientation = ({ isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToPortrait();
    }

    return () => Orientation.lockToPortrait();
  }, [isVisible]);
};

export default useOrientation;
