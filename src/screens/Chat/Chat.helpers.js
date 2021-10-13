import moment from 'moment';
import _ from 'lodash';

const formatDateSeparator = (date) => {
  const today = moment(moment()).startOf('day').format();
  const currentYear = moment(moment()).year();

  if (moment(date).startOf('day').format() === today) {
    return 'Today';
  }

  const isDifferentYears = moment(date).year() !== currentYear;

  return moment(date).format(`MMMM D${isDifferentYears ? ', YYYY' : ''}`);
};

export const addDateSepatorsToMessages = (messages) => {
  const messagesByDays = _.groupBy(messages, m => moment(m.createdOn).startOf('day').format());

  const firstDayMessages = _.map(messagesByDays, messagesOfDay => _.minBy(messagesOfDay, 'createdOn'));

  return messages.reduce((acc, message) => {
    acc.push(message);

    const firstMessage = firstDayMessages.find(firstDayMessage => firstDayMessage._id === message._id);
    if (firstMessage) {
      acc.push({
        isDateSeparator: true,
        text: formatDateSeparator(message.createdOn),
      });
    }

    return acc;
  }, []);
};

export const getUnreadMessageId = ({ messages, userId }) => {
  return messages.slice().reverse().find((message) => {
    if (!message._id) {
      return false;
    }
    const userMessage = message.participants.find(p => p._id === userId);
    return userMessage.isUnread;
  })._id;
};

export const addUnreadMessagesLabel = ({ messages, unreadLabelMessageId, unreadCount }) => {
  const messageIndex = messages.findIndex(m => m._id === unreadLabelMessageId);

  return [
    ...messages.slice(0, messageIndex + 1),
    {
      isNewMessagesLabel: true,
      unreadCount,
    },
    ...messages.slice(messageIndex + 1),
  ];
};
