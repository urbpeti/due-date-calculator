const {
  MILLISECOUNDS_IN_ONE_HOUR,
} = require('./const/constants.js');

function calculateDueDate(submitdate, turnaroundtime) {
  return addHoursToDate(submitdate, turnaroundtime);
}

function addHoursToDate(date, hours) {
  return new Date(date.getTime() + hoursToMilliseconds(hours));
}

function hoursToMilliseconds(hour) {
  return hour * MILLISECOUNDS_IN_ONE_HOUR;
}

module.exports = calculateDueDate;
