import { ApolloCache } from 'apollo-cache';
import { CachePersistor } from '..';

export type LogLevel = 'log' | 'warn' | 'error';

export type LogLine = [LogLevel, any[]];

export type TriggerUninstallFunction = () => void;

export type TriggerFunction = (persist: () => void) => TriggerUninstallFunction;

export type PersistedData<T> = T | string | null;

export interface PersistentStorage<T> {
  getItem: (key: string) => Promise<T> | T;
  setItem: (key: string, data: T) => Promise<void> | void;
  removeItem: (key: string) => Promise<void> | void;
}

export type OnEncryptionError<T> = (
  error: Error,
  persistor: CachePersistor<T>
) => void;

export interface EncryptOptions<T> {
  onError?: OnEncryptionError<T>;
  secretKey: string;
}

export interface ApolloPersistOptions<TSerialized> {
  cache: ApolloCache<TSerialized>;
  storage: PersistentStorage<PersistedData<TSerialized>>;
  trigger?: 'write' | 'background' | TriggerFunction | false;
  debounce?: number;
  key?: string;
  serialize?: boolean;
  maxSize?: number | false;
  debug?: boolean;
  encrypt?: EncryptOptions<TSerialized>;
}
