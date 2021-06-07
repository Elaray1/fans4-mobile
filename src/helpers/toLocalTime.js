import moment from 'moment-timezone';

export const toLocalDate = (item) => {
  const eventDate = moment(item.date).tz(item.location.timezone);

  const currentYear = moment().tz(item.location.timezone).year();
  const eventYear = eventDate.year();

  return `${eventDate.format(`ddd, MMM DD${currentYear !== eventYear ? ', YYYY' : ''}`)}`;
};

export const toLocalTime = (item) => {
  const eventDate = moment(item.date).tz(item.location.timezone);
  return `${eventDate.format('h:mm a z')}`;
};

export const toLocalDateAndTime = (item) => {
  return `${toLocalDate(item)} / ${toLocalTime(item)}`;
};
