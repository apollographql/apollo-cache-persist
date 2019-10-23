import { ApolloPersistOptions } from './types';
import CachePersistor from './CachePersistor';
import Persistor, { PersistorConfig } from './Persistor';
import Storage from './Storage';

/**
 * Add cache to persist engine using synchronous API
 * 
 * @see SynchronousCachePersistor for advanced use cases
 * @param options options for persist engine
 */
export const persistCacheSync = <T>(options: ApolloPersistOptions<T>) => {
  const cachePersistor = new SynchronousCachePersistor(options);
  cachePersistor.restoreSync();
};

/**
 * Persistor engine that is going to use synchronous api
 */
export class SynchronousCachePersistor<T> extends CachePersistor<T> {
  persistor: SynchronousPersistor<T>;

  constructor(options: ApolloPersistOptions<T>) {
    super(options);

    this.storage = new SynchronousStorage(options);
    this.persistor = new SynchronousPersistor(
      { log: this.log, cache: this.cache, storage: this.storage },
      options,
    );
  }

  restoreSync() {
    this.persistor.restoreSync();
  }
}

export class SynchronousPersistor<T> extends Persistor<T> {
  storage: SynchronousStorage<T>;

  constructor(
    { log, cache, storage }: PersistorConfig<T>,
    options: ApolloPersistOptions<T>,
  ) {
    super({ log, cache, storage }, options);
  }

  restoreSync() {
    this.cache.restore(this.storage.readSync());
  }
}

export class SynchronousStorage<T> extends Storage<T> {
  constructor(options: ApolloPersistOptions<T>) {
    super(options);
  }

  readSync(): any {
    return this.storage.getItem(this.key);
  }
}
