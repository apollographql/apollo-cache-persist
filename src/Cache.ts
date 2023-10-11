import { ApolloCache } from '@apollo/client/core';
import { ApolloPersistOptions, PersistedData } from './types';

export default class Cache<T> {
  cache: ApolloCache<T>;
  serialize: boolean;
  includeOptimistic: boolean;

  constructor(options: Pick<ApolloPersistOptions<T>, 'cache' | 'serialize' | 'includeOptimistic'>) {
    const { cache, serialize = true, includeOptimistic = false } = options;

    this.cache = cache;
    this.serialize = serialize;
    this.includeOptimistic = includeOptimistic;
  }

  extract(): PersistedData<T> {
    let data: PersistedData<T> = this.cache.extract(this.includeOptimistic) as T;

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
