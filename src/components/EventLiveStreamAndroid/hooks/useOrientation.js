import { useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';

const useOrientation = ({ visible }) => {
  useEffect(() => {
    if (visible) {
      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToPortrait();
    }

    return () => Orientation.lockToPortrait();
  }, [visible]);
};

export default useOrientation;
