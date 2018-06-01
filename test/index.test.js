const calculateDueDate = require('../');
const {
  MISSING_ARGUMENTS,
  INVALID_SUBMITTINGDATE,
  INVALID_TURNAROUNDTIME,
  SUBMITTING_MUST_BE_IN_WORKING_HOURS,
} = require('../messages/error/index.js');


describe('calculate due date', () => {
  let submittingDate;

  beforeEach(() => {
    submittingDate = new Date(2018, 4, 31, 9, 0, 0, 0);
  });

  describe('with invalid arguments', () => {
    test('invalid first argument', () => {
      expect(() => calculateDueDate('not a date', 1))
        .toThrow(INVALID_SUBMITTINGDATE);
      expect(() => calculateDueDate(1, 1))
        .toThrow(INVALID_SUBMITTINGDATE);
    });

    describe('submitting date is not in working ours', () => {
      test('submitting date is before working ours', () => {
        submittingDate = new Date(2018, 5, 1, 7, 0, 0, 0);
        expect(() => calculateDueDate(submittingDate, 1))
          .toThrow(SUBMITTING_MUST_BE_IN_WORKING_HOURS);
      });

      test('submitting date is after working ours', () => {
        submittingDate = new Date(2018, 5, 1, 17, 0, 0, 1);
        expect(() => calculateDueDate(submittingDate, 1))
          .toThrow(SUBMITTING_MUST_BE_IN_WORKING_HOURS);
      });

      test('submitting date is in weekends', () => {
        submittingDate = new Date(2018, 5, 2, 9, 0, 0, 0);
        expect(() => calculateDueDate(submittingDate, 1))
          .toThrow(SUBMITTING_MUST_BE_IN_WORKING_HOURS);
      });
    });

    test('invalid second argument', () => {
      expect(() => calculateDueDate(submittingDate, 'not an integer'))
        .toThrow(INVALID_TURNAROUNDTIME);
      expect(() => calculateDueDate(submittingDate, 1.1))
        .toThrow(INVALID_TURNAROUNDTIME);
      expect(() => calculateDueDate(submittingDate, -1))
        .toThrow(INVALID_TURNAROUNDTIME);
    });

    test('missing arguments', () => {
      expect(() => calculateDueDate())
        .toThrow(MISSING_ARGUMENTS);
      expect(() => calculateDueDate(new Date()))
        .toThrow(MISSING_ARGUMENTS);
    });
  });

  test('due date ends in the same day', () => {
    const dueDate = calculateDueDate(submittingDate, 3).getTime();
    const expectedDate = new Date(2018, 4, 31, 12, 0, 0, 0).getTime();

    expect(dueDate).toBe(expectedDate);
  });

  test('due date ends in the next day', () => {
    const dueDate = calculateDueDate(submittingDate, 9).getTime();
    const expectedDate = new Date(2018, 5, 1, 10, 0, 0, 0).getTime();

    expect(dueDate).toBe(expectedDate);
  });

  test('due date ends in the next day morning', () => {
    const dueDate = calculateDueDate(submittingDate, 8).getTime();
    const expectedDate = new Date(2018, 5, 1, 9, 0, 0, 0).getTime();

    expect(dueDate).toBe(expectedDate);
  });

  test('due date starts in the middle of the day', () => {
    submittingDate = new Date(2018, 4, 31, 14, 12, 0, 0);
    const dueDate = calculateDueDate(submittingDate, 8).getTime();
    const expectedDate = new Date(2018, 5, 1, 14, 12, 0, 0).getTime();

    expect(dueDate).toBe(expectedDate);
  });

  test('due date trougth the weekends', () => {
    const dueDate = calculateDueDate(submittingDate, 16).getTime();
    const expectedDate = new Date(2018, 5, 4, 9, 0, 0, 0).getTime();

    expect(dueDate).toBe(expectedDate);
  });

  test('with big turnaround time', () => {
    submittingDate = new Date(2018, 5, 4, 9, 12, 13, 144);
    const dueDate = calculateDueDate(submittingDate, 4160).getTime();
    const expectedDate = new Date(2020, 5, 1, 9, 12, 13, 144).getTime();

    expect(dueDate).toBe(expectedDate);
  });
});
