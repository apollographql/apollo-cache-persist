import Log from './Log';
import Cache from './Cache';
import Storage from './Storage';
import Persistor from './Persistor';
import Trigger from './Trigger';

export default class CachePersistor {
  constructor(options) {
    const log = new Log(options);
    const cache = new Cache(options);
    const storage = new Storage(options);
    const persistor = new Persistor({log, cache, storage}, options);
    const trigger = new Trigger({log, persistor}, options);

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

  pause() {
    return this.trigger.pause();
  }

  resume() {
    return this.trigger.resume();
  }

  remove() {
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

  getSize() {
    return this.storage.getSize();
  }
}
