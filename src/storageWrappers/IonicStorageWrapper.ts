import { PersistentStorage } from '../types';

export class IonicStorageWrapper implements PersistentStorage<string> {
  // Actual type definition: https://github.com/ionic-team/ionic-storage/blob/main/src/storage.ts#L102
  private storage;

  constructor(storage: any) {
    this.storage = storage;
  }

  getItem(key: string): string | Promise<string | null> | null {
    return this.storage.get(key);
  }

  removeItem(key: string): void | Promise<void> {
    return this.storage.remove(key);
  }

  setItem(key: string, value: string): void | Promise<void> {
    return this.storage.set(key, value);
  }
}
