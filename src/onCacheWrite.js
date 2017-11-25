export default ({cache}) => (callback) => {
  const write = cache.write;
  cache.write = (...args) => {
    write.apply(cache, args);
    callback();
  };

  return () => {
    cache.write = write;
  };
};
