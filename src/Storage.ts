import {
  ApolloPersistOptions,
  PersistentStorage,
  PersistedData,
} from './types';

export default class Storage<T> {
  storage: PersistentStorage<PersistedData<T>>;
  key: string;

  constructor(options: ApolloPersistOptions<T>) {
    const { storage, key = 'apollo-cache-persist' } = options;

    this.storage = storage;
    this.key = key;
  }

  read(): Promise<PersistedData<T>> {
    return this.storage.getItem(this.key);
  }

  write(data: PersistedData<T>): Promise<void> {
    return this.storage.setItem(this.key, data);
  }

  purge(): Promise<void> {
    return this.storage.removeItem(this.key);
  }

  async getSize(): Promise<number | null> {
    const data = await this.storage.getItem(this.key);

    if (data == null) {
      return 0;
    } else {
      return typeof data === 'string' ? data.length * 2 : null;
    }
  }
}
