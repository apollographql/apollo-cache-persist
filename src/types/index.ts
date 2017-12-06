import { ApolloCache } from 'apollo-cache';

export interface PersistentStorage<T> {
  getItem: (key: string) => Promise<T>;
  setItem: (key: string, data: T) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

export interface ApolloPersistOptions<T> {
  cache: ApolloCache<T>;
  storage: PersistentStorage<T>;
  trigger?: 'write' | 'background';
  debounce?: number;
  key?: string;
  serialize?: boolean;
  debug?: boolean;
}
