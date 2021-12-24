import { useEffect } from 'react';
import Platform from 'react-native';

import * as eventApi from 'resources/event/event.api';


const usePrefetchLinkAndroid = ({ eventId, setEventStreamLink }) => {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      return;
    }

    const getStreamLink = async () => {
      const { link } = await eventApi.getStreamLinkByEventId(eventId);
      setEventStreamLink(link);
    };

    getStreamLink();
  }, [eventId, setEventStreamLink]);
};

export default usePrefetchLinkAndroid;
