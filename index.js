const {
  MILLISECONDS_IN_ONE_HOUR,
  MILLISECONDS_IN_ONE_DAY,
  WORK_STARTING_HOUR,
  WORK_ENDING_HOUR,
} = require('./const/constants.js');

const {
  MISSING_ARGUMENTS,
  INVALID_SUBMITTINGDATE,
  INVALID_TURNAROUNDTIME,
  SUBMITTING_MUST_BE_IN_WORKING_HOURS,
} = require('./messages/error/index.js');

function calculateDueDate(submitDate, turnaroundTime) {
  checkArguments(submitDate, turnaroundTime);
  checkSubmitDateInWorkingHours(submitDate);

  let remainingTime = hoursToMilliseconds(turnaroundTime);
  let dueDate = new Date(submitDate);
  while (remainingTime > 0) {
    const workingMillisecondsLeft = workingMilliseconds(dueDate);
    if (remainingTime - workingMillisecondsLeft < 0) {
      return addMillisecondsToDate(dueDate, remainingTime);
    }

    remainingTime -= workingMillisecondsLeft;
    dueDate = nextWorkdayMorning(dueDate);
  }

  return dueDate;
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
    throw new Error(SUBMITTING_MUST_BE_IN_WORKING_HOURS);
  }
}

function isWeekend(date) {
  return date.getDay() === 6 || date.getDay() === 0;
}

function inWorkingHours(date) {
  const dateTime = date.getTime();
  const workStart = new Date(date).setHours(WORK_STARTING_HOUR, 0, 0, 0);
  const workEnd = new Date(date).setHours(WORK_ENDING_HOUR, 0, 0, 0);

  return workStart <= dateTime && dateTime < workEnd;
}

function workingMilliseconds(date) {
  return new Date(date).setHours(WORK_ENDING_HOUR, 0, 0, 0) - date.getTime();
}

function addMillisecondsToDate(date, milliseconds) {
  return new Date(date.getTime() + milliseconds);
}

function hoursToMilliseconds(hour) {
  return hour * MILLISECONDS_IN_ONE_HOUR;
}

function nextWorkdayMorning(date) {
  const newDate = nextDay(date);
  if (isWeekend(newDate)) {
    return nextWorkdayMorning(newDate);
  }
  return new Date(newDate.setHours(WORK_STARTING_HOUR, 0, 0, 0));
}

function nextDay(date) {
  return new Date(date.getTime() + MILLISECONDS_IN_ONE_DAY);
}

module.exports = calculateDueDate;
