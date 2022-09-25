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
export const persistCacheSync = <T, U extends boolean = true>(options: ApolloPersistOptions<T, U>) => {
  const cachePersistor = new SynchronousCachePersistor(options);
  cachePersistor.restoreSync();
};

/**
 * Persistor engine that is going to use synchronous api
 */
export class SynchronousCachePersistor<T, U extends boolean = true> extends CachePersistor<T, U> {
  persistor: SynchronousPersistor<T>;

  constructor(options: ApolloPersistOptions<T, U>) {
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

export class SynchronousPersistor<T, U extends boolean = true> extends Persistor<T, U> {
  storage: SynchronousStorage<T, U>;

  constructor(
    { log, cache, storage }: PersistorConfig<T>,
    options: ApolloPersistOptions<T, U>,
  ) {
    super({ log, cache, storage }, options);
  }

  restoreSync() {
    this.cache.restore(this.storage.readSync());
  }
}

export class SynchronousStorage<T, U extends boolean = true> extends Storage<T, U> {
  constructor(options: ApolloPersistOptions<T, U>) {
    super(options);
  }

  readSync(): any {
    return this.storage.getItem(this.key);
  }
}
