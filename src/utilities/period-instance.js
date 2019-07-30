import { chunk, head, last, range } from 'lodash';

import { Calendar } from './calendars/calendar';

export class PeriodInstance {
  constructor(calendarId, type, preferences, year) {
    this._calendarId = calendarId || 'gregorian';
    this._type = type;
    this._preferences = preferences;
    this._periods = [];

    this._calendar = new Calendar(calendarId);

    if (!this._calendar) {
      throw new Error('Calendar could not be set');
    }

    this._year = year || this._calendar.getCurrentYear();
    this._month = this._calendar.getCurrentMonth();
    this._quarter = this._calendar.getCurrentQuarter();
    this._biMonth = this._calendar.getCurrentBiMonth();
    this._sixMonth = this._calendar.getCurrentSixMonth();
    this._sixmonthApril = this._calendar.getCurrentSixMonthApril();
    this._sixMonthNovember = this._calendar.getCurrentSixMonthNovember();
    this._monthNames = this._calendar.getMonths();
    this._quarterMonthOffset = this._calendar.getQuarterMonthOffset();
  }

  get() {
    this._periods = this.getPeriods(this._type, this._year);

    if (
      (this._preferences && this._preferences.allowFuturePeriods) ||
      this._type.indexOf('Relative') !== -1
    ) {
      return this._periods;
    }

    return this.omitFuturePeriods(
      this.includeLastPeriods(this._periods, this._type, this._year),
      this._type
    ).reverse();
  }

  year() {
    return this._year;
  }

  currentYear() {
    return this._calendar.getCurrentYear();
  }

  getPeriods(type, year, offset = 0) {
    let periods;

    switch (type) {
      case 'Monthly': {
        periods = this.getMonthlyPeriods(year, offset);
        break;
      }

      case 'Quarterly': {
        periods = this.getQuarterlyPeriods(year);
        break;
      }

      case 'BiMonthly': {
        periods = this.getBiMonthlyPeriods(year);
        break;
      }

      case 'SixMonthly': {
        periods = this.getSixMonthlyPeriods(year);
        break;
      }

      case 'SixMonthlyApril': {
        periods = this.getSixMonthlyAprilPeriods(year);
        break;
      }

      case 'SixMonthlyNovember': {
        periods = this.getSixMonthlyNovemberPeriods(year);
        break;
      }

      case 'Yearly': {
        periods = this.getYearlyPeriods(year, 'Yearly');
        break;
      }

      case 'FinancialApril': {
        periods = this.getYearlyPeriods(year, 'FinancialApril', 'April', 3);
        break;
      }

      case 'FinancialJuly': {
        periods = this.getYearlyPeriods(year, 'FinancialJuly', 'July', 6);
        break;
      }

      case 'FinancialOctober': {
        periods = this.getYearlyPeriods(year, 'FinancialOctober', 'Oct', 9);
        break;
      }

      case 'FinancialNovember': {
        periods = this.getYearlyPeriods(year, 'FinancialNovember', 'Nov', 10);
        break;
      }

      case 'RelativeMonth':
      case 'RelativeBiMonth':
      case 'RelativeQuarter':
      case 'RelativeSixMonth':
      case 'RelativeYear':
      case 'RelativeFinancialYear':
      case 'RelativeWeek': {
        periods = this.getRelativePeriods(type);
        break;
      }

      default:
        periods = [];
        break;
    }

    return periods;
  }

  includeLastPeriods(periods, type, year) {
    const lastYearPeriods = this.getPeriods(type, year - 1);
    const currentPeriods = periods;

    return (periods || []).map((period, periodIndex) => {
      const lastPeriod =
        currentPeriods[periodIndex - 1] || last(lastYearPeriods);

      const newLastPeriod = {
        id: lastPeriod.id,
        name: lastPeriod.name
      };

      period.lastPeriod = newLastPeriod;

      return period;
    });
  }

  getRelativePeriods(type) {
    switch (type) {
      case 'RelativeBiMonth': {
        return [
          { id: 'THIS_BIMONTH', type, name: 'This Bi-month' },
          {
            id: 'LAST_BIMONTH',
            type,
            name: 'Last Bi-month'
          },
          { id: 'LAST_6_BIMONTHS', type, name: 'Last 6 bi-month' }
        ];
      }

      case 'RelativeMonth': {
        return [
          { id: 'THIS_MONTH', type, name: 'This Month' },
          { id: 'LAST_MONTH', type, name: 'Last Month' },
          {
            id: 'LAST_3_MONTHS',
            type,
            name: 'Last 3 Months'
          },
          { id: 'LAST_6_MONTHS', type, name: 'Last 6 Months' },
          { id: 'LAST_12_MONTHS', type, name: 'Last 12 Months' }
        ];
      }

      case 'RelativeQuarter': {
        return [
          { id: 'THIS_QUARTER', type, name: 'This Quarter' },
          {
            id: 'LAST_QUARTER',
            type,
            name: 'Last Quarter'
          },
          { id: 'LAST_4_QUARTERS', type, name: 'Last 4 Quarters' }
        ];
      }

      case 'RelativeSixMonth': {
        return [
          { id: 'THIS_SIX_MONTH', type, name: 'This Six-month' },
          {
            id: 'LAST_SIX_MONTH',
            type,
            name: 'Last Six-month'
          },
          { id: 'LAST_2_SIXMONTHS', type, name: 'Last 2 Six-month' }
        ];
      }

      case 'RelativeYear': {
        return [
          { id: 'THIS_YEAR', type, name: 'This Year' },
          {
            id: 'LAST_YEAR',
            type,
            name: 'Last Year'
          },
          { id: 'LAST_5_YEARS', type, name: 'Last 5 Years' }
        ];
      }

      case 'RelativeFinancialYear': {
        return [
          { id: 'THIS_FINANCIAL_YEAR', type, name: 'This Financial Year' },
          {
            id: 'LAST_FINANCIAL_YEAR',
            type,
            name: 'Last Financial Year'
          },
          { id: 'LAST_5_FINANCIAL_YEARS', type, name: 'Last 5 Financial Years' }
        ];
      }

      case 'RelativeWeek': {
        return [
          { id: 'THIS_WEEK', type, name: 'This Week' },
          { id: 'LAST_WEEK', type, name: 'Last Week' },
          {
            id: 'LAST_4_WEEKS',
            type,
            name: 'Last 4 Weeks'
          },
          { id: 'LAST_12_WEEKS', type, name: 'last 12 Weeks' },
          { id: 'LAST_52_WEEKS', type, name: 'Last 52 weeks' }
        ];
      }

      default:
        return [];
    }
  }
  getMonthlyPeriods(year, offset = 0) {
    const monthPeriods = (this._monthNames || []).map(
      (monthName, monthIndex) => {
        const monthOffset = monthIndex + 1 - this._quarterMonthOffset;
        const monthYear = monthOffset > 12 ? year - 1 : year;
        const id = this.getMonthPeriodId(monthYear, monthIndex + 1);

        return {
          id,
          type: 'Monthly',
          name: `${monthName} ${monthYear}`,
          daily: this.getChildrenPeriods(id, 'Monthly', 'Daily'),
          weekly: this.getChildrenPeriods(id, 'Monthly', 'Weekly')
        };
      }
    );

    return this.getMonthsByOffset(monthPeriods, offset);
  }

  getQuarterlyPeriods(year) {
    return chunk(
      this.getMonthsByOffset(
        this.getMonthWithYears(
          this._monthNames,
          year,
          this._quarterMonthOffset
        ),
        this._quarterMonthOffset
      ),
      3
    ).map((quarterMonths, quarterIndex) => {
      const id = this.getQuarterPeriodId(year, quarterIndex + 1);
      const startMonth = head(quarterMonths || []);
      const endMonth = last(quarterMonths || []);

      return {
        id,
        type: 'Quarterly',
        name: this.getPeriodNameByRange(startMonth, endMonth, year),
        daily: this.getChildrenPeriods(id, 'Quarterly', 'Daily'),
        weekly: this.getChildrenPeriods(id, 'Quarterly', 'Weekly'),
        monthly: this.getChildrenPeriods(id, 'Quarterly', 'Monthly')
      };
    });
  }

  getPeriodNameByRange(startMonth, endMonth, year) {
    return `${[startMonth.name + ` ${startMonth.year}`, endMonth.name].join(
      ' - '
    )} ${endMonth.year}`;
  }

  getMonthsByOffset(months, offset) {
    return [
      ...months.slice(offset),
      ...months.slice(0, months.length + offset)
    ];
  }

  getMonthWithYears(monthNames, year, offset) {
    return (monthNames || []).map((name, index) => {
      const monthOffset = index + 1 - offset;

      return { name, index, year: monthOffset > 12 ? year - 1 : year };
    });
  }

  getBiMonthlyPeriods(year) {
    return (chunk(this._monthNames || [], 2) || []).map(
      (biMonths, biMonthIndex) => {
        const id = this.getBiMonthlyPeriodId(year, biMonthIndex + 1);

        return {
          id,
          type: 'BiMonthly',
          name: `${[head(biMonths || []), last(biMonths || [])].join(
            ' - '
          )} ${year}`,
          daily: this.getChildrenPeriods(id, 'BiMonthly', 'Daily'),
          weekly: this.getChildrenPeriods(id, 'BiMonthly', 'Weekly'),
          monthly: this.getChildrenPeriods(id, 'BiMonthly', 'Monthly')
        };
      }
    );
  }

  getSixMonthlyPeriods(year) {
    return (chunk(this._monthNames || [], 6) || []).map(
      (sixMonths, sixMonthIndex) => {
        const id = this.getSixMonthlyPeriodId(year, sixMonthIndex + 1);

        return {
          id,
          type: 'SixMonthly',
          name: `${[head(sixMonths || []), last(sixMonths || [])].join(
            ' - '
          )} ${year}`,
          daily: this.getChildrenPeriods(id, 'SixMonthly', 'Daily'),
          weekly: this.getChildrenPeriods(id, 'SixMonthly', 'Weekly'),
          monthly: this.getChildrenPeriods(id, 'SixMonthly', 'Monthly')
        };
      }
    );
  }

  getSixMonthlyAprilPeriods(year) {
    const months = this.getMonthWithYears(this._monthNames, year + 1, -9);

    return (
      chunk([...months.slice(3), ...months.slice(0, 3)] || [], 6) || []
    ).map((sixMonthApril, sixMonthAprilIndex) => {
      const id = this.getSixMonthlyPeriodId(
        year,
        sixMonthAprilIndex + 1,
        'April'
      );

      return {
        id,
        type: 'SixMonthlyApril',
        name: this.getPeriodNameByRange(
          head(sixMonthApril || []),
          last(sixMonthApril || []),
          year
        ),
        daily: this.getChildrenPeriods(id, 'SixMonthlyApril', 'Daily'),
        weekly: this.getChildrenPeriods(id, 'SixMonthlyApril', 'Weekly'),
        monthly: this.getChildrenPeriods(id, 'SixMonthlyApril', 'Monthly')
      };
    });
  }

  getSixMonthlyNovemberPeriods(year) {
    return chunk(
      this.getMonthsByOffset(
        this.getMonthWithYears(this._monthNames, year, -2),
        this._quarterMonthOffset
      ),
      6
    ).map((sixMonthNovember, sixMonthNovemberIndex) => {
      const id = this.getSixMonthlyPeriodId(
        year,
        sixMonthNovemberIndex + 1,
        'Nov'
      );

      return {
        id,
        type: 'SixMonthlyNovember',
        name: this.getPeriodNameByRange(
          head(sixMonthNovember || []),
          last(sixMonthNovember || []),
          year
        ),
        daily: this.getChildrenPeriods(id, 'SixMonthlyNovember', 'Daily'),
        weekly: this.getChildrenPeriods(id, 'SixMonthlyNovember', 'Weekly'),
        monthly: this.getChildrenPeriods(id, 'SixMonthlyNovember', 'Monthly')
      };
    });
  }

  getYearlyPeriods(year, type, idSuffix = '', monthIndex = -1) {
    return range(10)
      .map(yearIndex => {
        const periodYear = parseInt(year, 10) - yearIndex;
        const id = this.getYearlyPeriodId(periodYear, idSuffix);
        const name = this.getYearlyPeriodName(periodYear, monthIndex);

        return {
          id,
          type,
          name,
          daily: this.getChildrenPeriods(id, type, 'Daily'),
          weekly: this.getChildrenPeriods(id, type, 'Weekly'),
          monthly: this.getChildrenPeriods(id, type, 'Monthly'),
          quarterly: this.getChildrenPeriods(id, type, 'Quarterly')
        };
      })
      .reverse();
  }

  omitFuturePeriods(periods, type) {
    // TODO Find a way to handle future periods
    // const currentPeriodId = this.getCurrentPeriodId(type);

    // return periods.filter(period => period.id < currentPeriodId);
    return periods;
  }

  getCurrentPeriodId(type, useCurrentYear = false) {
    switch (type) {
      case 'Monthly': {
        return this.getMonthPeriodId(
          this._calendar.getCurrentYear(),
          this._month
        );
      }
      case 'Quarterly': {
        return this.getQuarterPeriodId(
          this._calendar.getCurrentYear(),
          this._quarter
        );
      }

      case 'BiMonthly': {
        return this.getBiMonthlyPeriodId(
          this._calendar.getCurrentYear(),
          this._biMonth
        );
      }

      case 'SixMonthly': {
        return this.getSixMonthlyPeriodId(
          this._calendar.getCurrentYear(),
          this._sixMonth
        );
      }

      case 'SixMonthlyApril': {
        return this.getSixMonthlyPeriodId(
          this._calendar.getCurrentYear(),
          this._sixmonthApril,
          'April'
        );
      }

      case 'SixMonthlyNovember': {
        return this.getSixMonthlyPeriodId(
          this._calendar.getCurrentYear(),
          this._sixMonthNovember,
          'Nov'
        );
      }

      case 'Yearly': {
        return this._calendar.getCurrentYear();
      }

      case 'FinancialApril': {
        const currentYear = this._calendar.getCurrentYear();

        return this.getYearlyPeriodId(
          this._month >= 4 ? currentYear : currentYear - 1,
          'FinancialApril'
        );
      }

      case 'FinancialJuly': {
        const currentYear = this._calendar.getCurrentYear();

        return this.getYearlyPeriodId(
          this._month >= 7 ? currentYear : currentYear - 1,
          'FinancialJuly'
        );
      }

      case 'FinancialOctober': {
        const currentYear = this._calendar.getCurrentYear();

        return this.getYearlyPeriodId(
          this._month >= 10 ? currentYear : currentYear - 1,
          'FinancialOctober'
        );
      }

      case 'FinancialNovember': {
        const currentYear = this._calendar.getCurrentYear();

        return this.getYearlyPeriodId(
          this._month >= 11 ? currentYear : currentYear - 1,
          'FinancialNovember'
        );
      }

      default:
        return undefined;
    }
  }

  getMonthPeriodId(year, monthNumber) {
    return (
      year + (monthNumber < 10 ? `0${monthNumber}` : monthNumber).toString()
    );
  }

  getQuarterPeriodId(year, quarterNumber) {
    return `${year}Q${quarterNumber}`;
  }

  getBiMonthlyPeriodId(year, biMonthNumber) {
    return `${year}0${biMonthNumber}B`;
  }

  getSixMonthlyPeriodId(year, sixMonthNumber, sixMonthType = '') {
    return `${year}${sixMonthType}S${sixMonthNumber}`;
  }

  getYearlyPeriodId(year, suffix = '') {
    return `${year}${suffix}`;
  }

  getYearlyPeriodName(year, monthIndex = -1) {
    if (monthIndex === -1) {
      return year.toString();
    }

    return `${this._monthNames[monthIndex]} ${year} - ${
      this._monthNames[monthIndex - 1]
    } ${year + 1}`;
  }

  getYearlyMonthIndex(type) {}

  getChildrenPeriods(parentId, parentType, childrenType) {
    switch (parentType) {
      case 'Yearly': {
        const year = parseInt(parentId.slice(0, 4), 10);

        if (!isNaN(year)) {
          return this.getPeriods(childrenType, year).reverse();
        }
        return undefined;
      }

      case 'Quarterly': {
        const year = parseInt(parentId.slice(0, 4), 10);

        if (!isNaN(year)) {
          switch (childrenType) {
            case 'Monthly': {
              const quarterNumber = parseInt(parentId.slice(-1), 10);

              const monthPeriods = this.getPeriods(
                childrenType,
                year,
                this._quarterMonthOffset
              );

              return (monthPeriods || [])
                .filter((period, periodIndex) => {
                  const max = quarterNumber * 3;
                  const min = max - 3;

                  return periodIndex >= min && periodIndex < max;
                })
                .reverse();
            }

            default:
              return undefined;
          }
        }

        return undefined;
      }
      default:
        return undefined;
    }
  }
}
