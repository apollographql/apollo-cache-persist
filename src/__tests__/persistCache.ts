import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Hermes } from 'apollo-cache-hermes';

import { persistCache } from '../';
import MockStorage from '../__mocks__/MockStorage';
import simulateApp from '../__mocks__/simulateApp';

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
    it('extracts a previously filled HermesCache from storage', async () => {
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
    it('passing in debounce configures the debounce interval');
    it('passing in key customizes the storage key');
    it('setting the trigger to background sets your debounce interval to 0');
  });
});
