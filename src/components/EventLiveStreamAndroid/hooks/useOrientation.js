import { useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';

const useOrientation = () => {
  useEffect(() => {
    Orientation.unlockAllOrientations();
    return () => Orientation.lockToPortrait();
  }, []);
};

export default useOrientation;
