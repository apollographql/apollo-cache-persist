import onCacheWrite from './onCacheWrite';

export default ({cache, log}) => (callback) => {
  log.warn('Trigger option `background` not available on web; using `write` trigger');
  return onCacheWrite({cache, log})(callback);
};
