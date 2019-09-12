import MockStorage from '../__mocks__/MockStorage';
import MockCache from '../__mocks__/MockCache';
import Persistor from '../Persistor';
import Storage from '../Storage';
import Log from '../Log';

describe('Persistor', () => {
  const cache = new MockCache({ serialize: false });
  const storage = new Storage({ storage: new MockStorage() });
  jest.spyOn(storage, 'write');
  const persistor = new Persistor(
    {
      log: new Log({ debug: false }),
      storage,
      cache,
    },
    { maxSize: 100 },
  );

  it('should not write more than maxSize', async () => {
    cache.restore('0'.repeat(101));
    await persistor.persist();
    expect(storage.write).not.toHaveBeenCalled();
  });

  it('should not commit writes after pause', async () => {
    cache.restore('0'.repeat(101));
    persistor.persist();
    expect(storage.write).not.toHaveBeenCalled();
  });
});
