import Log from './Log';
import Storage from './Storage';
import Cache from './Cache';

import { ApolloPersistOptions } from './types';

export interface PersistorConfig<T> {
  log: Log<T>;
  cache: Cache<T>;
  storage: Storage<T>;
}

export default class Persistor<T> {
  log: Log<T>;
  cache: Cache<T>;
  storage: Storage<T>;
  maxSize?: number;
  paused: boolean;

  constructor(
    { log, cache, storage }: PersistorConfig<T>,
    options: ApolloPersistOptions<T>
  ) {
    const { maxSize = 1024 * 1024 } = options;

    this.log = log;
    this.cache = cache;
    this.storage = storage;
    this.paused = false;

    if (maxSize) {
      this.maxSize = maxSize;
    }
  }

  async persist(): Promise<void> {
    try {
      const cacheData = this.cache.cache.extract() as { [key: string]: any };
      const filteredData = Object.keys(cacheData)
        .filter((key: string) => {
          return !key.includes('ROOT_QUERY.tickers');
        })
        .reduce((obj: { [key: string]: any }, key: string) => {
          obj[key] = cacheData[key];
          return obj;
        }, {});
      const data = JSON.stringify(filteredData);
      this.log.info(filteredData);

      if (
        this.maxSize != null &&
        typeof data === 'string' &&
        data.length > this.maxSize &&
        !this.paused
      ) {
        await this.purge();
        this.paused = true;
        return;
      }

      if (this.paused) {
        this.paused = false;
      }

      await this.storage.write(data);

      this.log.info(
        typeof data === 'string'
          ? `Persisted cache of size ${data.length}`
          : 'Persisted cache'
      );
    } catch (error) {
      this.log.error('Error persisting cache', error);
      throw error;
    }
  }

  async restore(): Promise<void> {
    try {
      const data = await this.storage.read();

      if (data != null) {
        await this.cache.restore(data);

        this.log.info(
          typeof data === 'string'
            ? `Restored cache of size ${data.length}`
            : 'Restored cache'
        );
      } else {
        this.log.info('No stored cache to restore');
      }
    } catch (error) {
      this.log.error('Error restoring cache', error);
      throw error;
    }
  }

  async purge(): Promise<void> {
    try {
      await this.storage.purge();
      this.log.info('Purged cache storage');
    } catch (error) {
      this.log.error('Error purging cache storage', error);
      throw error;
    }
  }
}
