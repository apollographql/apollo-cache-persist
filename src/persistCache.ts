import CachePersistor from './CachePersistor';
import { ApolloPersistOptions } from './types';

export default <T>(options: ApolloPersistOptions<T>) => {
  const persistor = new CachePersistor(options);
  return persistor.restore();
};
