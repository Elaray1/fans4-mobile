import moment from 'moment';

const formatDateSeparator = (date) => {
  const today = moment(moment()).startOf('day').format();
  const currentYear = moment(moment()).year();

  if (moment(date).startOf('day').format() === today) {
    return 'Today';
  }

  const isDifferentYears = moment(date).year() !== currentYear;

  return moment(date).format(`MMMM D${isDifferentYears && ', YYYY'}`);
};

export const addDateSepatorsToMessages = (messages) => {
  const messagesByDays = messages.reduce((acc, message) => {
    const day = moment(message.createdOn).startOf('day').format();
    if (acc[day]) {
      acc[day].push(message);
    } else {
      acc[day] = [message];
    }

    return acc;
  }, {});

  const firstDayMessages = Object.keys(messagesByDays).map((day) => {
    const dayMessages = messagesByDays[day];
    const firstMessage = dayMessages.reduce((acc, message) => {
      if (message.createdOn < acc.createdOn) {
        return message;
      }
      return acc;
    }, dayMessages[0]);

    return firstMessage;
  });

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
