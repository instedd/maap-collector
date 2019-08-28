import moment from 'moment';

const isDate = date => moment(date).isValid() && typeof date !== 'undefined';

export default isDate;
