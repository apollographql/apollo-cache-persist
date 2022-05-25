import { PersistentStorage } from '../types';

/**
 * Wrapper for react-native-mmkv.
 * See [https://github.com/mrousavy/react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) for installation instructions.
 *
 * @example
 * const storage = new MMKV();
 * const persistor = new CachePersistor({
 *   cache,
 *   storage: new MMKVWrapper(storage),
 * });
 *
 */
export class MMKVWrapper implements PersistentStorage<string | null> {
  private storage;

  constructor(storage: MMKVInterface) {
    this.storage = storage;
  }

  getItem(key: string): string | null {
    return this.storage.getString(key) || null;
  }

  removeItem(key: string): void {
    return this.storage.delete(key);
  }

  setItem(key: string, value: string | null): void {
    if (value !== null) {
      return this.storage.set(key, value);
    }
    return this.removeItem(key);
  }
}

interface MMKVInterface {
    set: (key: string, value: boolean | string | number) => void;
    getString: (key: string) => string | undefined;
    delete: (key: string) => void;
}
