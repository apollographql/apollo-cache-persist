import { PersistentStorage } from '../types';

export default class MockStorage implements PersistentStorage<any> {
  storage: Map<string, string>;

  constructor() {
    this.storage = new Map();
  }

  setItem(key: string, data: string): Promise<void> {
    return new Promise(resolve => {
      this.storage.set(key, data);
      resolve();
    });
  }

  removeItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.delete(key);
      resolve();
    });
  }

  getItem(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(this.storage.get(key));
    });
  }
}
