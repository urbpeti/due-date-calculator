const calculateDueDate = require('../');

describe('calculated due date', () => {
  it('ends in the same day', () => {
    const submitDate = new Date(2018, 6, 1, 8, 0, 0, 0);
    const dueDate = calculateDueDate(submitDate, 3).getTime();
    const expectedDate = new Date(2018, 6, 1, 11, 0, 0).getTime();

    expect(dueDate).toBe(expectedDate);
  });
});
