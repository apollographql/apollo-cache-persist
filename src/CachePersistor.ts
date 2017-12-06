import Log from './Log';
import Cache from './Cache';
import Storage from './Storage';
import Persistor from './Persistor';
import Trigger from './Trigger';

import { ApolloPersistOptions } from './types';

export default class CachePersistor<T> {
  cache: Cache<T>;
  log: Log<T>;
  storage: Storage<T>;
  persistor: Persistor<T>;
  trigger: Trigger<T>;

  constructor(options: ApolloPersistOptions<T>) {
    const log = new Log(options);
    const cache = new Cache(options);
    const storage = new Storage(options);
    const persistor = new Persistor({ log, cache, storage });
    const trigger = new Trigger({ log, persistor }, options);

    this.log = log;
    this.cache = cache;
    this.storage = storage;
    this.persistor = persistor;
    this.trigger = trigger;
  }

  /**
   * Manual persistence controls.
   */

  persist() {
    return this.persistor.persist();
  }

  restore() {
    return this.persistor.restore();
  }

  purge() {
    return this.persistor.purge();
  }

  /**
   * Trigger controls.
   */

  pause(): void {
    return this.trigger.pause();
  }

  resume(): void {
    return this.trigger.resume();
  }

  remove(): void {
    return this.trigger.remove();
  }

  /**
   * Info accessor.
   */

  getLogs(print = false) {
    if (print) {
      this.log.tailLogs();
    } else {
      return this.log.getLogs();
    }
  }

  getSize(): Promise<number | null> {
    return this.storage.getSize();
  }
}
