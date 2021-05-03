import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatCount = (likes) => {
  if (likes < 1000) {
    return likes;
  }

  return `${(likes / 1000).toFixed(1)}k`;
};

export const formatTime = time => dayjs(time).fromNow();
