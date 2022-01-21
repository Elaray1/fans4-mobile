import useDidUpdate from 'hooks/useDidUpdate';
import Orientation from 'react-native-orientation-locker';

const useOrientation = ({ isFullScreen }) => {
  useDidUpdate(() => {
    if (isFullScreen) {
      Orientation.unlockAllOrientations();
    } else {
      Orientation.lockToPortrait();
    }

    return () => Orientation.lockToPortrait();
  }, [isFullScreen]);
};

export default useOrientation;
