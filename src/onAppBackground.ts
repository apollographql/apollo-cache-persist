import onCacheWrite from './onCacheWrite';

import { ApolloCache } from 'apollo-cache';
import Log from './Log';

export default <T extends {}>({
  cache,
  log,
}: {
  cache: ApolloCache<T>;
  log: Log<T>;
}) => callback => {
  log.warn(
    'Trigger option `background` not available on web; using `write` trigger'
  );
  return onCacheWrite({ cache, log })(callback);
};
