import { ApolloCache } from '@apollo/client/core';

export type LogLevel = 'log' | 'warn' | 'error';

export type LogLine = [LogLevel, any[]];

export type TriggerUninstallFunction = () => void;

export type TriggerFunction = (persist: () => void) => TriggerUninstallFunction;

export type PersistenceMapperFunction = (data: any) => Promise<any>;

export type PersistedData<T> = T | string | null;

export interface PersistentStorage<T> {
  getItem: (key: string) => Promise<T | null> | T | null;
  setItem: (key: string, value: T) => Promise<T> | Promise<void> | void | T;
  removeItem: (key: string) => Promise<T> | Promise<void> | void;
}

type StorageType<T, TSerialize extends boolean> = TSerialize extends true
  ? PersistentStorage<string>
  : PersistentStorage<T>;

export interface ApolloPersistOptions<
  TSerialized,
  TSerialize extends boolean = true,
> {
  /**
   * Reference to your Apollo cache.
   */
  cache: ApolloCache<TSerialized>;
  /**
   * Reference to your storage provider wrapped in a storage wrapper implementing `PersistentStorage` interface.
   */
  storage: StorageType<PersistedData<TSerialized>, TSerialize>;
  /**
   * When to persist the cache.
   *
   * `write`: Persist upon every write to the cache. Default.
   *
   * `background`: Persist when your app moves to the background. **React Native only**.
   *
   * For a custom trigger, provide a function. See below for more information.
   *
   * To disable automatic persistence and manage persistence manually, provide `false`.
   */
  trigger?: 'write' | 'background' | TriggerFunction | false;
  /**
   * Debounce interval between persists (in ms).
   * Defaults to `0` for `background` and `1000` for `write` and custom triggers.
   */
  debounce?: number;
  /**
   * Key to use with the storage provider. Defaults to `apollo-cache-persist`.
   */
  key?: string;
  /**
   * Whether to serialize to JSON before/after persisting. Defaults to `true`.
   */
  serialize?: TSerialize;
  /**
   * Maximum size of cache to persist (in bytes).
   * Defaults to `1048576` (1 MB). For unlimited cache size, provide `false`.
   * If exceeded, persistence will pause and app will start up cold on next launch.
   */
  maxSize?: number | false;
  persistenceMapper?: PersistenceMapperFunction;
  /**
   * Enable console logging.
   */
  debug?: boolean;
}
