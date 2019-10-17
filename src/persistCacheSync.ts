import { ApolloPersistOptions } from './types';
import CachePersistor from './CachePersistor';
import Persistor, { PersistorConfig } from './Persistor';
import Storage from './Storage';

export default <T>(options: ApolloPersistOptions<T>) => {
  const cachePersistor = new SynchronousCachePersistor(options);
  cachePersistor.restoreSync();
};

class SynchronousCachePersistor<T> extends CachePersistor<T> {
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

class SynchronousPersistor<T> extends Persistor<T> {
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

class SynchronousStorage<T> extends Storage<T> {
  constructor(options: ApolloPersistOptions<T>) {
    super(options);
  }

  readSync(): any {
    return this.storage.getItem(this.key);
  }
}
