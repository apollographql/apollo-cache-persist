import { PersistentStorage } from '../types';

/**
 * Wrapper for react-native's AsyncStorage.
 *
 * WARNING: AsyncStorage doesn't support values in excess of 2MB on Android.
 *
 * @example
 * const persistor = new CachePersistor({
 *   cache,
 *   storage: new AsyncStorageWrapper(AsyncStorage),
 * });
 *
 */
export class AsyncStorageWrapper implements PersistentStorage<any> {
  // Actual type definition: https://github.com/react-native-async-storage/async-storage/blob/master/types/index.d.ts
  private storage;

  constructor(storage: any) {
    this.storage = storage;
  }

  getItem(key: string): any | Promise<any> | null {
    return this.storage.getItem(key);
  }

  removeItem(key: string): void | Promise<void> {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: any): void | Promise<void> {
    return this.storage.setItem(key, value);
  }
}
