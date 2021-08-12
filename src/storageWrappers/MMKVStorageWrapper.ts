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
export class MMKVStorageWrapper implements PersistentStorage<string | null> {
  private storage;

  constructor(storage: MMKVStorageInterface) {
    this.storage = storage;
  }

  getItem(key: string): Promise<string | null> {
    return this.storage.getItem(key) || null;
  }

  removeItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Ensure the removeItem is thenable, even if it's not, by wrapping it to Promise.resolve
      // The MMKV storage's removeItem is synchronous since 0.5.7, this Promise wrap allows backward compatibility
      // https://stackoverflow.com/a/27746324/2078771
      Promise.resolve(this.storage.removeItem(key))
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  setItem(key: string, value: string | null): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage
        .setItem(key, value)
        .then(() => resolve())
        .catch(() => reject());
    });
  }
}

interface MMKVStorageInterface {
  // Actual type definition: https://github.com/ammarahm-ed/react-native-mmkv-storage/blob/master/index.d.ts#L27
  getItem(key: string): Promise<string | null | undefined>;
  setItem(key: string, value: string): Promise<boolean | undefined>;
  removeItem(key: string): boolean | undefined | Promise<boolean | undefined>;
}
