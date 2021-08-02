import { PersistentStorage } from '../types';

export class IonicStorageWrapper implements PersistentStorage<string | null> {
  private storage;

  constructor(storage: IonicStorageInterface) {
    this.storage = storage;
  }

  getItem(key: string): Promise<string | null> {
    return this.storage.get(key);
  }

  removeItem(key: string): Promise<void> {
    return this.storage.remove(key);
  }

  setItem(key: string, value: string | null): Promise<void> {
    return this.storage.set(key, value);
  }
}

interface IonicStorageInterface {
  // Actual type definition: https://github.com/ionic-team/ionic-storage/blob/main/lib/src/index.ts
  get(key: string): Promise<string | null>;
  set(key: string, value: string | null): Promise<void>;
  remove(key: string): Promise<void>;
}
