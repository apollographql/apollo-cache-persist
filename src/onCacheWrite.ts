import { ApolloCache } from 'apollo-cache';

export interface TriggerFunctionConfig<T> {
  cache: ApolloCache<T>;
}

export default <T>({ cache }: TriggerFunctionConfig<T>) => (
  persist: () => void
) => {
  const write = cache.write;
  cache.write = (...args: any[]) => {
    write.apply(cache, args);
    persist();
  };

  return () => {
    cache.write = write;
  };
};
