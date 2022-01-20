import moment from 'moment';

export default seconds => (seconds > 3600
  ? moment.duration(seconds, 'seconds').format('hh:mm:ss')
  : moment.duration(seconds, 'seconds').format('mm:ss'));
