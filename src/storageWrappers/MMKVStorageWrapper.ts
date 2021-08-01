import { PersistentStorage } from '../types';

/**
 * Wrapper for react-native-mmkv-storage.
 * See [https://rnmmkv.now.sh/#/gettingstarted](https://rnmmkv.now.sh/#/gettingstarted) for installation instructions.
 *
 * @example
 * const persistor = new CachePersistor({
 *   cache,
 *   storage: new MMKVStorageWrapper(new MMKVStorage.Loader().initialize()),
 * });
 *
 */
export class MMKVStorageWrapper implements PersistentStorage<any> {
  // Actual type definition: https://github.com/ammarahm-ed/react-native-mmkv-storage/blob/master/index.d.ts#L27
  private storage;

  constructor(storage: any) {
    this.storage = storage;
  }

  getItem(key: string): any | Promise<any> | null {
    return this.storage.getItem(key);
  }

  removeItem(key: string): void | Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage
        .removeItem(key)
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  setItem(key: string, value: any): void | Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage
        .setItem(key, value)
        .then(() => resolve())
        .catch(() => reject());
    });
  }
}
