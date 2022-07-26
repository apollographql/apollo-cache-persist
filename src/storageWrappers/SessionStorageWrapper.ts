import { PersistentStorage } from '../types';

export class SessionStorageWrapper implements PersistentStorage<string | null> {
  protected storage;

  constructor(storage: SessionStorageInterface) {
    this.storage = storage;
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  removeItem(key: string): void {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: string | null): void {
    if (value !== null) {
      // setting null to sessionstorage stores "null" as string
      return this.storage.setItem(key, value);
    } else {
      return this.removeItem(key);
    }
  }
}

interface SessionStorageInterface {
  // Actual type definition: https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts#L14276
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
