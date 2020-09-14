import { InMemoryCache, gql } from '@apollo/client/core';
import { Hermes } from 'apollo-cache-hermes';

import { persistCache } from '../';
import MockStorage from '../__mocks__/MockStorage';
import { simulateApp, simulateWrite } from '../__mocks__/simulate';

jest.useFakeTimers();
describe('persistCache', () => {
  describe('setup', () => {
    it('requires a cache', async () => {
      try {
        await persistCache({ storage: new MockStorage() });
        fail('invoking persistCache without a cache should throw an error');
      } catch (e) {
        expect(() => {
          throw e;
        }).toThrowErrorMatchingSnapshot();
      }
    });
    it('requires storage', async () => {
      try {
        await persistCache({ cache: new InMemoryCache() });
        fail('invoking persistCache without storage should throw an error');
      } catch (e) {
        expect(() => {
          throw e;
        }).toThrowErrorMatchingSnapshot();
      }
    });
  });

  describe('basic usage', () => {
    const operation = gql`
      {
        hello
      }
    `;
    const result = { data: { hello: 'world' } };

    it('extracts a previously filled InMemoryCache from storage', async () => {
      const [client, client2] = await simulateApp({
        operation,
        result,
      });
      expect(client.extract()).toEqual(client2.extract());
    });
    xit('extracts a previously filled HermesCache from storage', async () => {
      const [client, client2] = await simulateApp({
        operation,
        result,
        persistOptions: {
          cache: new Hermes(),
        },
      });
      expect(client.extract()).toEqual(client2.extract());
    });
  });

  describe('nested queries', () => {
    const operation = gql`
      {
        user(id: 1) {
          name {
            last
            first
          }
          posts {
            title
            comments {
              name
            }
          }
        }
      }
    `;
    const result = {
      data: {
        user: {
          name: { last: 'Doe', first: 'Jane', __typename: 'Name' },
          posts: [
            {
              title: 'Apollo is awesome',
              comments: [{ name: 'foo', __typename: 'Comment' }],
              __typename: 'Post',
            },
          ],
          __typename: 'User',
        },
      },
    };

    it('extracts a previously filled InMemoryCache from storage', async () => {
      const [client, client2] = await simulateApp({
        operation,
        result,
      });
      expect(client.extract()).toEqual(client2.extract());
    });
    xit('extracts a previously filled HermesCache from storage', async () => {
      const [client, client2] = await simulateApp({
        operation,
        result,
        persistOptions: {
          cache: new Hermes(),
        },
      });
      expect(client.extract()).toEqual(client2.extract());
    });
  });

  describe('advanced usage', () => {
    const operation = gql`
      {
        hello
      }
    `;
    const result = { data: { hello: 'world' } };

    it('passing in debounce configures the debounce interval', async () => {
      const debounce = 600;
      const storage = new MockStorage();

      await simulateWrite({
        result,
        operation,
        persistOptions: { debounce, storage },
      });

      expect(await storage.getItem('apollo-cache-persist')).toBe(undefined);
      jest.runTimersToTime(debounce + 1);
      expect(await storage.getItem('apollo-cache-persist')).toMatchSnapshot();
    });
    it('passing in key customizes the storage key', async () => {
      const storage = new MockStorage();
      const key = 'testing-1-2-3';

      await simulateWrite({
        result,
        operation,
        persistOptions: { key, storage },
      });

      jest.runTimersToTime(1001);
      expect(await storage.getItem('apollo-cache-persist')).toBe(undefined);
      expect(await storage.getItem(key)).toMatchSnapshot();
    });
    it('setting maxSize purges the Apollo cache & storage if it crosses a threshold', async () => {
      const storage = new MockStorage();
      const cache = new InMemoryCache();

      await simulateWrite({
        result,
        operation,
        persistOptions: { storage, maxSize: 20 },
      });

      jest.runTimersToTime(1001);
      expect(await storage.getItem('apollo-cache-persist')).toMatchSnapshot();
    });
    xit('setting the trigger to background does not persist on a write', async () => {
      const storage = new MockStorage();
      await simulateWrite({
        result,
        operation,
        persistOptions: { trigger: 'background', storage },
      });

      jest.runTimersToTime(1001);
      expect(await storage.getItem('apollo-cache-persist')).toBe(undefined);
    });
    xit('setting the trigger to background persists in the background', () => {});
  });
});
