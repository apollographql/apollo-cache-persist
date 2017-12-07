import { ApolloClient } from 'apollo-client';
import { ApolloLink, Observable } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import { persistCache } from '../';
import MockStorage from './MockStorage';

export const simulateApp = async ({
  result,
  operation,
  persistOptions = {},
}) => {
  const cache = persistOptions.cache || new InMemoryCache();
  const storage = new MockStorage();

  await persistCache({ storage, ...persistOptions, cache });

  const link = new ApolloLink(() => {
    return Observable.of(result);
  });
  const client = client || new ApolloClient({ cache, link });

  await client.query({ query: operation });
  jest.runTimersToTime(
    persistOptions.debounce ? persistOptions.debounce + 1 : 1001
  );
  const extracted = client.extract();

  // cache is now persisted
  const cache2 = new cache.constructor();
  await persistCache({ cache: cache2, storage });
  const client2 = new ApolloClient({ cache: cache2, link });

  return [client, client2];
};

export const simulateWrite = async ({
  cache = new InMemoryCache(),
  storage = new MockStorage(),
  result,
  operation,
  ...rest,
}) => {
  await persistCache({ storage, cache, ...rest });

  const link = new ApolloLink(() => {
    return Observable.of(result);
  });
  const client = new ApolloClient({ cache, link });
  await client.query({ query: operation });
};
