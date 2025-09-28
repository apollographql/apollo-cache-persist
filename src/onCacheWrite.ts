import { ApolloCache } from '@apollo/client/core';

export interface TriggerFunctionConfig {
  cache: ApolloCache;
}

export default ({ cache }: TriggerFunctionConfig) => (
  persist: () => void
) => {
  const write = cache.write;
  const evict = cache.evict;
  const modify = cache.modify;
  const gc = cache.gc;

  cache.write = (...args: any[]) => {
    const result = write.apply(cache, args);
    persist();
    return result;
  };
  cache.evict = (...args: any[]) => {
    const result = evict.apply(cache, args);
    persist();
    return result;
  };
  cache.modify = (...args: any[]) => {
    const result = modify.apply(cache, args);
    persist();
    return result;
  };
  cache.gc = (...args: any[]) => {
    const result = gc.apply(cache, args);
    persist();
    return result;
  };

  return () => {
    cache.write = write;
    cache.evict = evict;
    cache.modify = modify;
    cache.gc = gc;
  };
};
