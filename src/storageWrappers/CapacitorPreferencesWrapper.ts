import {PersistentStorage} from "../types";

export class CapacitorPreferencesWrapper implements PersistentStorage<string | null> {
  private storage;

  constructor(storage: CapacitorPreferencesInterface) {
    this.storage = storage;
  }

  getItem(key: string): Promise<string | null> {
    return this.storage.get({key: key}).then(r => r.value);
  }

  removeItem(key: string): Promise<void> {
    return this.storage.remove({key: key});
  }

  setItem(key: string, value: string | null): Promise<void> {
    if (value) {
      // Capacitor Preferences does not support nullable values
      return this.storage.set({key: key, value: value});
    } else {
      return this.removeItem(key);
    }
  }
}

interface CapacitorPreferencesInterface {
  // Actual type definition: https://capacitorjs.com/docs/apis/preferences#api
  get(options: { key: string }): Promise<{ value: string | null }>;

  set(options: { key: string, value: string }): Promise<void>;

  remove(options: { key: string }): Promise<void>;
}
