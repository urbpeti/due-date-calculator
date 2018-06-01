const {
  MILLISECOUNDS_IN_ONE_HOUR,
} = require('./const/constants.js');

const {
  MISSING_ARGUMENTS,
  INVALID_SUBMITTINGDATE,
  INVALID_TURNAROUNDTIME,
  SUBMITTING_MUST_BE_IN_WORKING_OURS,
} = require('./messages/error/index.js');

function calculateDueDate(submitDate, turnaroundTime) {
  checkArguments(submitDate, turnaroundTime);
  checkSubmitDateInWorkingHours(submitDate);

  return addHoursToDate(submitDate, turnaroundTime);
}

function checkArguments(submitDate, turnaroundTime) {
  if (submitDate === undefined || turnaroundTime === undefined) {
    throw new Error(MISSING_ARGUMENTS);
  }
  if (!(submitDate instanceof Date)) {
    throw new Error(INVALID_SUBMITTINGDATE);
  }
  if (!(Number.isInteger(turnaroundTime)) || turnaroundTime < 0) {
    throw new Error(INVALID_TURNAROUNDTIME);
  }
}

function checkSubmitDateInWorkingHours(submitDate) {
  if (!inWorkingHours(submitDate) || isWeekend(submitDate)) {
    throw new Error(SUBMITTING_MUST_BE_IN_WORKING_OURS);
  }
}

function isWeekend(date) {
  return date.getDay() === 6 || date.getDay() === 0;
}

function inWorkingHours(date) {
  const dateTime = date.getTime();
  const workStart = new Date(date).setHours(9, 0, 0, 0);
  const workEnd = new Date(date).setHours(17, 0, 0, 0);

  return workStart <= dateTime && dateTime < workEnd;
}

function addHoursToDate(date, hours) {
  return new Date(date.getTime() + hoursToMilliseconds(hours));
}

function hoursToMilliseconds(hour) {
  return hour * MILLISECOUNDS_IN_ONE_HOUR;
}

module.exports = calculateDueDate;
