import { useEffect, useState } from 'react';

import useDidUpdate from 'hooks/useDidUpdate';

import websocketsService from 'services/socket.service';

// const getEventsByAttachedPostId = (posts, events) => {
//   const sortedPosts = _.sortBy(posts, post => -moment(post.createdOn).unix());

//   const eventsByAttachedPostId = {};

//   events.forEach((event) => {
//     let isEventAttached = false;

//     sortedPosts.forEach((post, i) => {
//       if (isEventAttached) {
//         return;
//       }

//       let postId;

//       if (event.date <= post.createdOn) {
//         postId = post._id;
//       } else if (i === posts.length - 1) {
//         postId = sortedPosts[0]._id;
//       } else {
//         return;
//       }

//       eventsByAttachedPostId[postId] = eventsByAttachedPostId[postId] || [];
//       eventsByAttachedPostId[postId].push(event);
//       eventsByAttachedPostId[postId] = _.sortBy(eventsByAttachedPostId[postId], e => -moment(e.data).unix());
//       isEventAttached = true;
//     });
//   });

//   return eventsByAttachedPostId;
// };

const useEventsLiveStreamsUpdated = ({ posts, preloadedEvents }) => {
  const [eventsWithLiveStream, setEventsWithLiveStream] = useState(preloadedEvents || []);

  useDidUpdate(() => {
    setEventsWithLiveStream(preloadedEvents);
  }, [preloadedEvents]);

  useEffect(() => {
    websocketsService.joinRoom('events');
    websocketsService.on('events:liveStreamsUpdated', (events) => {
      console.log('liveStreamUpdated events', events);
      setEventsWithLiveStream(events);
    });

    return () => {
      websocketsService.off('events:liveStreamsUpdated', setEventsWithLiveStream);
      websocketsService.leaveRoom('events');
    };
  }, []);


  return eventsWithLiveStream;
};

export default useEventsLiveStreamsUpdated;
