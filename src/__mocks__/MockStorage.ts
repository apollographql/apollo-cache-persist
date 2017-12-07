import { PersistentStorage } from '../types';

export default class MockStorage<T> implements PersistentStorage<T> {
  storage: Map<string, string>;

  constructor() {
    this.storage = new Map();
  }

  setItem(key: string, data: T): Promise<any> {
    return new Promise(resolve => {
      this.storage.set(key, data);
      resolve();
    });
  }

  removeItem(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const deleted = this.storage.delete(key);
      if (deleted) {
        resolve();
      } else {
        reject(new Error('Key not found, item was not deleted'));
      }
    });
  }

  getItem(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      resolve(this.storage.get(key));
    });
  }
}
