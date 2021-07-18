import { Analytics } from './model/analytics.js';
import { AnalyticsResult } from './result/analytics-result';
import { EventAnalytics } from './model/event-analytics';
import { SQLViewData } from './model/sql-view.js';
import { Runner } from './utilities/runner.js';
import { Dependency } from './utilities/dependency';
import { MultiFetcher } from './utilities/multi-fetcher';
import { IdentifiableObject } from './model/identifiable-object.js';
import { Period } from './model/period';
import { PeriodType } from './model/period-type';

/**
 * This is the main holder for the functionalities of the function
 * @namespace
 * @type {{Promise: ProgressPromise, Analytics: Analytics,
 *   AnalyticsResult: AnalyticsResult,
 *   OrganisationUnit: OrganisationUnit, SQLViewData: SQLViewData,
 *   Runner: Runner, Dependency: Dependency, MultiFetcher: MultiFetcher,
 *   all: (function(Fetcher[])), init: (function(*=))}
 * }
 */
let Fn = {
  Analytics: Analytics,
  EventAnalytics: EventAnalytics,
  AnalyticsResult: AnalyticsResult,
  IdentifiableObject: IdentifiableObject,
  SQLViewData: SQLViewData,
  Runner: Runner,
  Dependency: Dependency,
  Period,
  PeriodType,
  MultiFetcher: MultiFetcher,
  /**
   * Adds multiple fetchers in queue for execution.
   *
   * @param {Fetcher[]} fetchers - The fethers is an array of the fetchers
   * @returns {ProgressPromise} - Progress Promise for fetching the various fetchers
   * @example
   * Fn.all([new Fn.Analytics(), new Fn.OrganisationUnit()]);
   */
  all: fetchers => {
    return new MultiFetcher(fetchers);
  },
  /**
   * Configures the running environment parameters
   *
   * @param {Object} configuration - The fethers is an array of the fetchers
   * @returns {ProgressPromise} - Progress Promise for fetching the various fetchers
   * @example
   * Fn.all({baseUrl:''});
   */
  init: config => {
    Runner.initiateRunner(config);
  }
};

if (typeof window !== 'undefined') {
  window.Fn = Fn;
}
export { Fn };
