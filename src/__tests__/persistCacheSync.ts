import { InMemoryCache } from 'apollo-cache-inmemory';
import { SynchronousCachePersistor } from '../';
import MockStorageSync from '../__mocks__/MockStorageSync';
import { ApolloLink } from 'apollo-link';
import Observable = require('zen-observable');
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';

jest.useFakeTimers();
describe('persistCacheSync', () => {
  describe('setup', () => {
    it('persists cache', async () => {
      const operation = gql`
        {
          hello
        }
      `;
      const result = { data: { hello: 'world' } };
      const storage = new MockStorageSync();
      const cache = new InMemoryCache();

      const persistOptions = { cache, storage };
      const cachePersistor = new SynchronousCachePersistor(persistOptions);

      const link = new ApolloLink(() => Observable.of(result));
      const client = new ApolloClient({ cache, link });
      expect(cache.extract()).toEqual({});

      await client.query({ query: operation });
      jest.runTimersToTime(
        persistOptions.debounce ? persistOptions.debounce + 1 : 1001,
      );

      const cache2 = new InMemoryCache();
      const cachePersistor2 = new SynchronousCachePersistor({
        cache: cache2,
        storage,
      });
      debugger;
      cachePersistor2.restoreSync();
      const keys = Object.keys(cache2.extract());
      expect(keys.length).toEqual(1);
    });
  });
});
