import { ApolloCache } from 'apollo-cache';
import { ApolloPersistOptions } from './types';

type PersistedData<T> = T | string;

export default class Cache<T> {
  cache: ApolloCache<T>;
  serialize: boolean;

  constructor(options: ApolloPersistOptions<T>) {
    const { cache, serialize = true } = options;

    this.cache = cache;
    this.serialize = serialize;
  }

  extract(): PersistedData<T> {
    let data = this.cache.extract() as T;

    if (this.serialize) {
      data = JSON.stringify(data) as string;
    }

    return data;
  }

  restore(data: PersistedData<T>): void {
    if (this.serialize) {
      data = JSON.parse(data);
    }

    if (data != null) {
      this.cache.restore(data);
    }
  }
}
