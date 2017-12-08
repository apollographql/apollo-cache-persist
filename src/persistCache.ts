import CachePersistor from './CachePersistor';
import { ApolloPersistOptions } from './types';

export default <T>(options: ApolloPersistOptions<T>) => {
  if (!options.cache) {
    throw new Error(`
      In order to persist your Apollo Cache, you need to pass in a cache.
      Please see https://www.apollographql.com/docs/react/basics/caching.html for our default InMemoryCache.
    `);
  }

  if (!options.storage) {
    throw new Error(`
      In order to persist your Apollo Cache, you need to pass in an underlying storage provider.
      Please see https://github.com/apollographql/apollo-cache-persist#storage-providers
    `);
  }

  const persistor = new CachePersistor(options);
  return persistor.restore();
};
