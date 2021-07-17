import moment from 'moment';

export default seconds => moment.duration(seconds, 'seconds').format('mm:ss');
