import { PersistentStorage } from '../types';

export class LocalForageWrapper<T = string | object | null>
  implements PersistentStorage<T>
{
  protected storage;

  constructor(storage: LocalForageInterface<T>) {
    this.storage = storage;
  }

  getItem(key: string): Promise<T | null> {
    return this.storage.getItem(key);
  }

  removeItem(key: string): Promise<void> {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: T | null): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage
        .setItem(key, value)
        .then(() => resolve())
        .catch(() => reject());
    });
  }
}

export interface LocalForageInterface<T = string | object | null> {
  // Actual type definition: https://github.com/localForage/localForage/blob/master/typings/localforage.d.ts#L17
  getItem(key: string): Promise<T | null>;
  setItem(key: string, value: T | null): Promise<T | null>;
  removeItem(key: string): Promise<void>;
}
