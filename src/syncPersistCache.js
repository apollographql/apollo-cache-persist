import { CachePersistor } from 'apollo-cache-persist';
import Persistor from 'apollo-cache-persist/Persistor';
import Storage from 'apollo-cache-persist/Storage';

export default function(options) {
  const cachePersistor = new SynchronousCachePersistor(options);
  cachePersistor.syncRestore();
}

class SynchronousCachePersistor extends CachePersistor {
  constructor(options) {
    super(options);

    this.storage = new SynchronousStorage(options);
    this.persistor = new SynchronousPersistor(
      { log: this.log, cache: this.cache, storage: this.storage },
      options,
    );
  }

  syncRestore() {
    this.persistor.syncRestore();
  }
}

class SynchronousPersistor extends Persistor {
  constructor({ log, cache, storage }, options) {
    super({ log, cache, storage }, options);
  }

  syncRestore() {
    this.cache.restore(this.storage.syncRead());
  }
}

class SynchronousStorage extends Storage {
  constructor(options) {
    if (
      options.storage !== window.localStorage &&
      options.storage !== window.sessionStorage
    ) {
      new Error(
        'SynchronousStorage supports only synchronous storage providers (winodw.localStorage and window.sessionStorage).',
      );
    }
    super(options);
  }

  syncRead() {
    return this.storage.getItem(this.key);
  }
}
