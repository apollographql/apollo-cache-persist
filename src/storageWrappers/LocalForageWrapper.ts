import { PersistentStorage } from '../types';

export class LocalForageWrapper
  implements PersistentStorage<string | object | null> {
  private storage;

  constructor(storage: LocalForageInterface) {
    this.storage = storage;
  }

  getItem(key: string): Promise<string | null> {
    return this.storage.getItem(key);
  }

  removeItem(key: string): Promise<void> {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: string | object | null): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage
        .setItem(key, value)
        .then(() => resolve())
        .catch(() => reject());
    });
  }
}

interface LocalForageInterface {
  // Actual type definition: https://github.com/localForage/localForage/blob/master/typings/localforage.d.ts#L17
  getItem(key: string): Promise<string | null>;
  setItem(
    key: string,
    value: string | object | null,
  ): Promise<string | object | null>;
  removeItem(key: string): Promise<void>;
}
