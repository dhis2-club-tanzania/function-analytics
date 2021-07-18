import axios from 'axios';
import httpadapter from 'axios/lib/adapters/http';
import xhradapter from 'axios/lib/adapters/xhr';
// import { ProgressPromise } from './progress-promise';
let _instance;

/**
 * Runner represents the process which will schedule and run operations of the processes
 */
export class Runner {
  /**
   * Initiates the runner singleton instance
   * @param configurations
   */
  static initiateRunner(configurations) {
    if (!Runner.instance) {
      this.config = configurations;
      this.cache = {};
      _instance = this;
    }
  }

  /**
   * Get the Runner instance
   * @returns {Runner}
   */
  get instance() {
    return _instance;
  }

  /**
   * Set the configuration
   * @param configurations
   */
  set config(configurations) {
    this.config = configurations;
  }

  /**
   * Get the configurations
   * @returns {*}
   */
  get config() {
    return this.config;
  }

  /**
   * This callback type is called `resolveCallback`.
   *
   * @callback resolveCallback
   * @param {Object} responseResult
   */

  /**
   * This callback type is called `rejectCallback`.
   *
   * @callback rejectCallback
   * @param {Error} error
   */

  /**
   * Fetches the data from the fetcher
   * @param {Fetcher} fetcher
   * @param {resolveCallback} resolve
   * @param {rejectCallback} reject
   * @private
   */
  _fetch(fetcher, resolve, reject) {
    if (!_instance) {
      let error =
        'Configuration not set please configure function ' +
        'analytics eg {baseUrl:"dhis_base_url", username:"username", ' +
        'password:"password"}';

      throw Error(error);
    }
    let hashed = fetcher.hash();

    if (!_instance.cache[hashed]) {
      _instance.cache[hashed] = {
        finished: false,
        resolutions: []
      };
      const config = {
        url: _instance.config.baseUrl + fetcher.url,
        method: 'get',
        adapter: typeof process !== 'undefined' ? httpadapter : xhradapter
      };

      if (_instance.config.username && _instance.config.password) {
        config.auth = {
          username: _instance.config.username,
          password: _instance.config.password
        };
      }
      axios.request(config).then(
        results => {
          _instance.cache[hashed].data = results.data;
          resolve(
            fetcher.performPostProcess(
              JSON.parse(JSON.stringify(_instance.cache[hashed].data))
            )
          );
          _instance.cache[hashed].resolutions.forEach(resolution => {
            resolution(
              fetcher.performPostProcess(
                JSON.parse(JSON.stringify(_instance.cache[hashed].data))
              )
            );
          });
          _instance.cache[hashed].finished = true;
        },
        err => {
          reject(err);
        }
      );
    } else {
      if (!_instance.cache[hashed].finished) {
        _instance.cache[hashed].resolutions.push(resolve);
      } else {
        resolve(
          fetcher.performPostProcess(
            JSON.parse(JSON.stringify(_instance.cache[hashed].data))
          )
        );
      }
    }
  }

  /**
   * Fetches data related to a fetcher
   * @param {Fetcher} fetcher
   * @returns {ProgressPromise}
   */
  getResults(fetcher) {
    if (fetcher._fetchers) {
      // If is a multifetcher
      return this.getAllResults(fetcher);
    }
    return new Promise((resolve, reject) => {
      if (fetcher.hasDependencies()) {
        fetcher
          .getDependecyFetchResults()
          .then(() => {
            fetcher.performPreProcess();
            this._fetch(fetcher, resolve, reject);
          })
          .catch(err => {
            console.log(err);
            reject();
          });
      } else {
        this._fetch(fetcher, resolve, reject);
      }
    });
  }

  /**
   * Fetches data for multiple fetchers
   * @param {MultiFetcher} multifetcher
   * @returns {Promise}
   */
  getAllResults(multifetcher) {
    return new Promise((resolve, reject) => {
      const promises = multifetcher.fetchers.map(fetcher =>
        new Runner().getResults(fetcher)
      );

      return Promise.all(promises)
        .then(results => {
          resolve(multifetcher.performPostProcess(results));
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
