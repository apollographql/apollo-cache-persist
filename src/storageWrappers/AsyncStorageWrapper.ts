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
export class AsyncStorageWrapper implements PersistentStorage<string | null> {
  private storage;

  constructor(storage: AsyncStorageInterface) {
    this.storage = storage;
  }

  getItem(key: string): Promise<string | null> {
    return this.storage.getItem(key);
  }

  removeItem(key: string): Promise<void> {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: string | null): Promise<void> {
    return this.storage.setItem(key, value);
  }
}

interface AsyncStorageInterface {
  // Actual type definition: https://github.com/react-native-async-storage/async-storage/blob/master/types/index.d.ts
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string | null): Promise<void>;
  removeItem(key: string): Promise<void>;
}
