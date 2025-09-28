import { ApolloCache } from '@apollo/client/core';
import { ApolloPersistOptions, PersistedData } from './types';

export default class Cache<T> {
  cache: ApolloCache;
  serialize: boolean;

  constructor(options: Pick<ApolloPersistOptions<T>, 'cache' | 'serialize'>) {
    const { cache, serialize = true } = options;

    this.cache = cache;
    this.serialize = serialize;
  }

  extract(): PersistedData<T> {
    let data: PersistedData<T> = this.cache.extract() as T;

    if (this.serialize) {
      data = JSON.stringify(data) as string;
    }

    return data;
  }

  restore(data: PersistedData<T>): void {
    if (this.serialize && typeof data === 'string') {
      data = JSON.parse(data);
    }

    if (data != null) {
      this.cache.restore(data as T);
    }
  }
}
