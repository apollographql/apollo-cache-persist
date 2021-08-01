import { PersistentStorage } from '../types';

export class LocalForageWrapper implements PersistentStorage<any> {
  // Actual type definition: https://github.com/localForage/localForage/blob/master/typings/localforage.d.ts#L17
  private storage;

  constructor(storage: any) {
    this.storage = storage;
  }

  getItem(key: string): any | Promise<any> | null {
    return this.storage.getItem(key);
  }

  removeItem(key: string): void | Promise<void> {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: any): void | Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage
        .setItem(key, value)
        .then(() => resolve())
        .catch(() => reject());
    });
  }
}
