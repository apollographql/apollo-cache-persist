import CachePersistor from './CachePersistor';
import { ApolloPersistOptions } from './types';

export default <T extends {}>(options: ApolloPersistOptions<T>) => {
  const persistor = new CachePersistor(options);
  persistor.restore();
};
