import moment from 'moment-timezone';

export const toLocalDate = (item) => {
  const eventDate = moment(item.date);

  const currentYear = moment().year();
  const eventYear = eventDate.year();

  return `${eventDate.format(`ddd, MMM DD${currentYear !== eventYear ? ', YYYY' : ''}`)}`;
};

export const toLocalTime = (item) => {
  const eventDate = moment(item.date);
  return `${eventDate.tz(item.location.timezone).format('h:mm a z')}`;
};

export const toLocalDateAndTime = (item) => {
  return `${toLocalDate(item)} / ${toLocalTime(item)}`;
};
