import { PersistentStorage } from '../types';

export class IonicStorageWrapper implements PersistentStorage<any> {
  // Actual type definition: https://github.com/ionic-team/ionic-storage/blob/main/src/storage.ts#L102
  private storage;

  constructor(storage: any) {
    this.storage = storage;
  }

  getItem(key: string): any | Promise<any> | null {
    return this.storage.get(key);
  }

  removeItem(key: string): void | Promise<void> {
    return this.storage.remove(key);
  }

  setItem(key: string, value: any): void | Promise<void> {
    return this.storage.set(key, value);
  }
}
