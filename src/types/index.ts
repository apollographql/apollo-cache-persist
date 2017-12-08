import { ApolloCache } from 'apollo-cache';

export interface SerializedData {
  length: number;
}

export type PersistedData<T> = T | string;

export interface PersistentStorage<X> {
  getItem: (key: string) => Promise<X>;
  setItem: (key: string, data: X) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

export interface ApolloPersistOptions<CacheShape> {
  cache: ApolloCache<CacheShape>;
  storage: PersistentStorage<PersistedData<CacheShape>>;
  trigger?: 'write' | 'background';
  debounce?: number;
  key?: string;
  serialize?: boolean;
  debug?: boolean;
}
