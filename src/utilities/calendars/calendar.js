import { EthiopianCalendar } from './ethiopian-calender';
import { GregorianCalendar } from './gregorian-calendar';

export class Calendar {
  constructor(calendarId) {
    this._calendarId = calendarId;
    this._calendar = {};

    this.getInstance();
  }

  getInstance() {
    switch (this._calendarId) {
      case 'ethiopian':
        this._calendar = new EthiopianCalendar();
        return this;
      default:
        this._calendar = new GregorianCalendar();

        if (!this._calendar) {
          throw new Error('Calendar could not be instantiated');
        }

        return this;
    }
  }

  getMonths() {
    const monthsNames = this._calendar.monthNames();

    return monthsNames.length === 13 ? monthsNames.slice(0, -1) : monthsNames;
  }

  getCurrentYear() {
    return this._calendar.today().year();
  }

  getCurrentMonth() {
    return this._calendar.today().month();
  }

  getCurrentDay() {
    return this._calendar.today().day();
  }

  getQuarterMonthOffset() {
    return this._calendar.quarterMonthOffset();
  }

  getCurrentQuarter() {
    const difference = this.getCurrentMonth() - this.getQuarterMonthOffset();

    return Math.ceil((difference > 12 ? 1 : difference) / 3);
  }

  getCurrentBiMonth() {
    return Math.ceil(this.getCurrentMonth() / 2);
  }

  getCurrentSixMonth() {
    return Math.ceil(this.getCurrentMonth() / 6);
  }

  getCurrentSixMonthApril() {
    const currentMonth = this.getCurrentMonth();

    return currentMonth >= 4 && currentMonth <= 9 ? 1 : 2;
  }

  getCurrentSixMonthNovember() {
    const currentMonth = this.getCurrentMonth();

    return currentMonth >= 5 && currentMonth <= 10 ? 2 : 1;
  }
}
