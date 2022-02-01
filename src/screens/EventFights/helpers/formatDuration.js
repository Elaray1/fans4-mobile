import moment from 'moment';
import 'moment-duration-format';


export default (seconds) => {
  return moment.duration(seconds, 's')
    .format(seconds >= 3600 ? 'hh:mm:ss' : 'mm:ss', { trim: false });
};
