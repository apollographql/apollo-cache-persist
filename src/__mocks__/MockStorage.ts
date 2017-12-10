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
      this.storage.delete(key);
      resolve();
    });
  }

  getItem(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      resolve(this.storage.get(key));
    });
  }
}
