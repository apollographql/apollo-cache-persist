import { ApolloCache } from '@apollo/client/core';

export interface TriggerFunctionConfig<T> {
  cache: ApolloCache<T>;
}

export default <T>({ cache }: TriggerFunctionConfig<T>) => (
  persist: () => void,
) => {
  const write = cache.write;
  cache.write = (...args: any[]) => {
    const ref = write.apply(cache, args);
    persist();
    return ref;
  };

  return () => {
    cache.write = write;
  };
};
