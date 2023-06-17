import {
  ApolloClient,
  ApolloLink,
  DocumentNode,
  InMemoryCache,
  Observable,
} from '@apollo/client/core';

import { persistCache } from '../';
import MockStorage from './MockStorage';
import { ApolloPersistOptions } from '../types';

export const simulateApp = async <T>({
  result,
  operation,
  persistOptions = {},
}: {
  result: T;
  operation: DocumentNode;
  persistOptions?: Partial<ApolloPersistOptions<any>>;
}) => {
  const storage = persistOptions.storage || new MockStorage();
  const cache = persistOptions.cache || new InMemoryCache();

  await persistCache({ ...persistOptions, cache, storage });

  const link = new ApolloLink(() => Observable.of(result));
  const client = new ApolloClient({ cache, link });

  await client.query({ query: operation });
  jest.advanceTimersByTime(
    persistOptions.debounce ? persistOptions.debounce + 1 : 1001,
  );

  // cache is now persisted
  const cache2 = cache.constructor();
  await persistCache({ ...persistOptions, cache: cache2, storage });
  const client2 = new ApolloClient({ cache: cache2, link });

  return [client, client2];
};

export const simulateWrite = async <T>({
  result,
  operation,
  persistOptions = {},
}: {
  result: T;
  operation: DocumentNode;
  persistOptions?: Partial<ApolloPersistOptions<any>>;
}) => {
  const storage = persistOptions.storage || new MockStorage();
  const cache = persistOptions.cache || new InMemoryCache();

  await persistCache({ ...persistOptions, cache, storage });

  const link = new ApolloLink(() => Observable.of(result));
  const client = new ApolloClient({ cache, link });
  await client.query({ query: operation });
};
