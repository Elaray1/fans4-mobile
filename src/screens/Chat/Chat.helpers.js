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
