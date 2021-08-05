import { MultiFetcher } from "./utilities/multi-fetcher";
import { Runner } from "./utilities/runner";
import { Analytics } from "./models/analytics";
import { EventAnalytics } from "./models/event-analytics";
import { AnalyticsResult } from "./utilities/analytics-result";
import { IdentifiableObject } from "./models/identifiable-object";
import { SQLViewData } from "./models/sql-view";
import { Dependency } from "./utilities/dependency";
import { Fetcher } from "./utilities/fetcher";
import { FnConfig } from "./interfaces/config.interface";
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

function init(config: FnConfig) {
  Runner.initiateRunner(config);
}

function all(fetchers: Fetcher[]) {
  return new MultiFetcher(fetchers);
}

let Fn = {
  Analytics,
  EventAnalytics,
  AnalyticsResult,
  IdentifiableObject,
  SQLViewData,
  Runner,
  Dependency,
  MultiFetcher,
  /**
   * Adds multiple fetchers in queue for execution.
   *
   * @param {Fetcher[]} fetchers - The fethers is an array of the fetchers
   * @returns {ProgressPromise} - Progress Promise for fetching the various fetchers
   * @example
   * Fn.all([new Fn.Analytics(), new Fn.OrganisationUnit()]);
   */
  all,
  /**
   * Configures the running environment parameters
   *
   * @param {Object} configuration - The fethers is an array of the fetchers
   * @returns {ProgressPromise} - Progress Promise for fetching the various fetchers
   * @example
   * Fn.all({baseUrl:''});
   */
  init,
};

if (typeof window !== "undefined") {
  (window as any).Fn = Fn;
}

export {
  Fn,
  init,
  all,
  Analytics,
  EventAnalytics,
  AnalyticsResult,
  IdentifiableObject,
  SQLViewData,
  Runner,
  MultiFetcher,
  Dependency,
};
