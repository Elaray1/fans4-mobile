import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

function useIsConnected() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
  }, []);

  return isConnected;
}

export default useIsConnected;
