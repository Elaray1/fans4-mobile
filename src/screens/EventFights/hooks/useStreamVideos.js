import { useEffect, useState } from 'react';
import moment from 'moment';

import * as eventApi from 'resources/event/event.api';
import { LIVE_STREAM_STATUSES } from 'resources/event/event.constants';


const useStreamVideos = ({ eventId, streamStatus, streamFinishedOnDate }) => {
  const [streamVideos, setStreamVideos] = useState([]);

  useEffect(() => {
    if (streamStatus !== LIVE_STREAM_STATUSES.FINISHED
      || moment(streamFinishedOnDate).add(3, 'hours') > moment()) {
      return;
    }

    const getStreamVideos = async () => {
      const { videos } = await eventApi.getEventVideos(eventId);
      setStreamVideos(videos);
    };

    getStreamVideos();
  }, [eventId, streamStatus, streamFinishedOnDate]);

  return streamVideos;
};

export default useStreamVideos;
