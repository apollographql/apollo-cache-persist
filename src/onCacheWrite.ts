import { ApolloCache } from 'apollo-cache';
import Log from './Log';

export default <T extends {}>({
  cache,
}: {
  cache: ApolloCache<T>;
  log: Log<T>;
}) => callback => {
  const write = cache.write;
  cache.write = (...args) => {
    write.apply(cache, args);
    callback();
  };

  return () => {
    cache.write = write;
  };
};
