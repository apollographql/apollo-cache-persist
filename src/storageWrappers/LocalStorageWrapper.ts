import { PersistentStorage } from '../types';

export class LocalStorageWrapper implements PersistentStorage<string> {
  // Actual type definition: https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts#L15286
  private storage;

  constructor(storage: any) {
    this.storage = storage;
  }

  getItem(key: string): string | Promise<string | null> | null {
    return this.storage.getItem(key);
  }

  removeItem(key: string): void | Promise<void> {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: string): void | Promise<void> {
    return this.storage.setItem(key, value);
  }
}
