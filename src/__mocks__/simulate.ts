import {
  ApolloClient,
  ApolloLink,
  DocumentNode,
  InMemoryCache,
} from '@apollo/client/core';
import { of } from 'rxjs';

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

  const link = new ApolloLink(() => of(result));
  const client = new ApolloClient({ cache, link });

  await client.query({ query: operation });
  jest.advanceTimersByTime(
    persistOptions.debounce ? persistOptions.debounce + 1 : 1001,
  );

  // cache is now persisted
  // @ts-ignore
  const cache2 = new cache.constructor();
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

  const link = new ApolloLink(() => of(result));
  const client = new ApolloClient({ cache, link });
  await client.query({ query: operation });
};
