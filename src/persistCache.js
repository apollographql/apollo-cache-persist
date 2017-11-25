import CachePersistor from './CachePersistor';

export default (options) => {
  const persistor = new CachePersistor(options);
  persistor.restore();
};
