import { PersistentStorage } from '../types';

export default class MockStorageSync implements PersistentStorage {
  storage: Map<string, string>;

  constructor() {
    this.storage = new Map();
  }

  setItem(key: string, data: string): void {
    this.storage.set(key, data);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  getItem(key: string): any {
    return this.storage.get(key);
  }
}
