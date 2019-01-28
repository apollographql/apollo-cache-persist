import Log from './Log';
import Storage from './Storage';
import Cache from './Cache';
import * as CryptoJS from 'crypto-js';

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
  encryptionKey?: string;

  constructor(
    { log, cache, storage }: PersistorConfig<T>,
    options: ApolloPersistOptions<T>
  ) {
    const { maxSize = 1024 * 1024, encryptionKey } = options;

    this.log = log;
    this.cache = cache;
    this.storage = storage;
    this.paused = false;

    if (maxSize) {
      this.maxSize = maxSize;
    }

    if (encryptionKey) {
      this.encryptionKey = encryptionKey;
    }
  }

  async persist(): Promise<void> {
    try {
      const data = this.cache.extract();

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

      if (this.encryptionKey && typeof data === 'string') {
        const encryptedData = CryptoJS.AES.encrypt(
          data,
          this.encryptionKey
        ).toString();
        await this.storage.write(encryptedData);
      } else {
        await this.storage.write(data);
      }

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
        if (this.encryptionKey && typeof data === 'string') {
          const bytes = CryptoJS.AES.decrypt(data, this.encryptionKey);
          const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
          await this.cache.restore(decryptedString);
        } else {
          await this.cache.restore(data);
        }

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
