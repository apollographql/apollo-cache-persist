import { ApolloCache } from 'apollo-cache';

export type LogLevel = 'log' | 'warn' | 'error';

export type LogLine = [LogLevel, any[]];

export type TriggerUninstallFunction = () => void;

export type TriggerFunction = (persist: () => void) => TriggerUninstallFunction;

export type PersistedData<T> = T | string;

export interface PersistentStorage<T> {
  getItem: (key: string) => Promise<T>;
  setItem: (key: string, data: T) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

export interface ApolloPersistOptions<TSerialized> {
  cache: ApolloCache<TSerialized>;
  storage: PersistentStorage<PersistedData<TSerialized>>;
  trigger?: 'write' | 'background' | TriggerFunction;
  debounce?: number;
  key?: string;
  serialize?: boolean;
  debug?: boolean;
}
