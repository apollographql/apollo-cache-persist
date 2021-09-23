import { PersistentStorage } from '../types';

export default class MockStorage implements PersistentStorage<any> {
  storage: Map<string, any>;

  constructor() {
    this.storage = new Map();
  }

  setItem(key: string, data: any): Promise<void> {
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

  getItem(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.storage.get(key));
    });
  }

  getSize(key: string): Promise<number> {
    return new Promise(resolve => {
      if (this.storage.size === 0) return resolve(0);
      const data = this.storage.get(key);
      resolve((typeof data === 'string' ? data : JSON.stringify(data)).length);
    });
  }
}
