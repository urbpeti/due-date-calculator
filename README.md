# due-date-calculator

[![Build Status](https://travis-ci.org/urbpeti/due-date-calculator.svg?branch=master)](https://travis-ci.org/urbpeti/due-date-calculator)
![license](https://img.shields.io/github/license/mashape/apistatus.svg)

Calculate the due date for a bug report with a given turnaround time.

## Installing

```
git clone https://github.com/urbpeti/due-date-calculator.git
```

## Running the tests

```
npm test
```

## Example usage

``` js
const dueDateCalculator = require('./due-date-calculator');

const submitDate = new Date(2018, 4, 31, 9, 0, 0, 0);
const turnaroundTime = 16;

const dueDate = dueDateCalculator(submitDate, turnaroundTime);
//dueDate == 2018.6.4 9:00 
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details