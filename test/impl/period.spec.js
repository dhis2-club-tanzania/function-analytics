/* global describe, it, before */

import chai from 'chai';
import { Fn } from '../../src/index';

chai.expect();

const expect = chai.expect;

let period;

describe('Given and instance of Period class', () => {
  before(() => {
    period = new Fn.Period();
  });

  it('should be instantiated', () => {
    expect(period).to.be.instanceOf(Fn.Period);
  });
});

describe('Geven I set period type', () => {
  before(() => {
    period.setType('Monthly');
  });

  it('should return set period type', () => {
    expect(period.type()).to.be.equal('Monthly');
  });
});

describe('Given I set monthly period type', () => {
  let periodResult;

  before(() => {
    period
      .setCalendar('ethiopian')
      .setType('Monthly')
      .get();
    periodResult = period.list();
  });

  it('should return monthly period list for the current year', () => {
    expect(periodResult.length <= 12).to.be.equal(true);
  });
});

// describe('Given I set monthly period type and previous year', () => {
//   let periodResult;

//   before(() => {
//     const previousYear = period.currentYear() - 1;

//     period
//       .setType('Monthly')
//       .setYear(previousYear)
//       .get();

//     periodResult = period.list();
//   });

//   it('should return monthly period list for 12 months', () => {
//     expect(periodResult.length === 12).to.be.equal(true);
//   });
// });

describe('Given I set quarterly period type', () => {
  let periodResult;

  before(() => {
    period = new Fn.Period();

    period
      .setType('Quarterly')
      .setCalendar('gregorian')
      .setPreferences({
        allowFuturePeriods: false,
        childrenPeriodSortOrder: 'ASC'
      })
      .get();
    periodResult = period.list();
  });

  it('should return quarterly period list for the current year', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set bi monthly period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('BiMonthly')
      .setYear(period.currentYear())
      .get();
    periodResult = period.list();
  });

  it('should return bi monthly period list for the current year', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set six monthly period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('SixMonthly')
      .setYear(period.currentYear())
      .get();
    periodResult = period.list();
    console.log(JSON.stringify(periodResult));
  });

  it('should return six monthly period list for the current year', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set six monthly april period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('SixMonthlyApril')
      .setYear(period.currentYear())
      .get();
    periodResult = period.list();
  });

  it('should return six monthly april period list for the current year', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set six monthly april period type and previous year', () => {
  let periodResult;

  before(() => {
    period
      .setType('SixMonthlyApril')
      .setYear(period.currentYear() - 1)
      .get();
    periodResult = period.list();
  });

  it('should return six monthly april period list for the previous year', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set six monthly november period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('SixMonthlyNovember')
      .setYear(period.currentYear())
      .get();
    periodResult = period.list();
  });

  it('should return six monthly november period list for the current year', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set six monthly november period type and previous year', () => {
  let periodResult;

  before(() => {
    period
      .setType('SixMonthlyNovember')
      .setYear(period.currentYear() - 1)
      .get();
    periodResult = period.list();
  });

  it('should return six monthly november period list for the previous year', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set financial april period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('FinancialApril')
      .setYear(period.currentYear())
      .get();
    periodResult = period.list();
  });

  it('should return Financial April period list for the current year', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set financial july period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('FinancialJuly')
      .setYear(period.currentYear())
      .get();
    periodResult = period.list();
  });

  it('should return Financial July period list for the current year', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set financial october period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('FinancialOctober')
      .setYear(period.currentYear())
      .get();
    periodResult = period.list();
  });

  it('should return Financial October period list for the current year', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set financial november period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('FinancialNovember')
      .setYear(period.currentYear())
      .get();
    periodResult = period.list();
  });

  it('should return Financial November period list for the current year', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set relative month period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('RelativeMonth')
      .setYear(period.currentYear())
      .get();

    periodResult = period.list();
  });

  it('should return Relative month period list', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set relative bi month period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('RelativeBiMonth')
      .setYear(period.currentYear())
      .get();

    periodResult = period.list();
  });

  it('should return Relative bi month period list', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set relative quarter period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('RelativeQuarter')
      .setYear(period.currentYear())
      .get();
    periodResult = period.list();
  });

  it('should return Relative quarter period list', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set relative year period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('RelativeYear')
      .setYear(period.currentYear())
      .get();

    periodResult = period.list();
  });

  it('should return Relative year period list', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set relative six month period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('RelativeSixMonth')
      .setYear(period.currentYear())
      .get();

    periodResult = period.list();
  });

  it('should return Relative six month period list', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set relative financial year period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('RelativeFinancialYear')
      .setYear(period.currentYear())
      .get();

    periodResult = period.list();
  });

  it('should return Relative financial year period list', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});

describe('Given I set relative weekly period type', () => {
  let periodResult;

  before(() => {
    period
      .setType('RelativeWeek')
      .setYear(period.currentYear())
      .get();

    periodResult = period.list();
  });

  it('should return Relative week period list', () => {
    expect(periodResult.length > 0).to.be.equal(true);
  });
});
// describe('Given I set quarterly period type and previous year', () => {
//   let periodResult;

//   before(() => {
//     const previousYear = period.currentYear() - 1;

//     period
//       .setType('Quarterly')
//       .setYear(previousYear)
//       .get();
//     periodResult = period.list();
//   });

//   it('should return quarterly period list of 4 quarters', () => {
//     expect(periodResult.length === 4).to.be.equal(true);
//   });
// });

// describe('Given I set yearly period type', () => {
//   let periodResult;

//   before(() => {
//     period
//       .setType('Yearly')
//       .setYear(period.currentYear())
//       .get();
//     periodResult = period.list();
//   });

//   it('should return yearly period list listing 9 years excluding current', () => {
//     expect(periodResult.length === 9).to.be.equal(true);
//   });
// });

describe('Given I set yearly period type and previous year', () => {
  let periodResult;

  before(() => {
    const previousYear = period.currentYear() - 1;

    period
      .setType('Yearly')
      .setYear(previousYear)
      .get();
    periodResult = period.list();
  });

  it('should return yearly period list listing 10 years', () => {
    expect(periodResult.length === 10).to.be.equal(true);
  });
});

// TODO: Write test to check if quarter period is selected then it should return valid number of months as children period
// TODO: Test to check if period instance can return future periods provided preference is set to do so
