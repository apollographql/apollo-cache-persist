import MockStorage from '../__mocks__/MockStorage';
import Storage from '../Storage';

describe('Storage', () => {
  const storage = new Storage({
    storage: new MockStorage(),
  });

  it('writes, reads, & deletes data from persistent storage', async () => {
    await expect(storage.write('yo yo yo')).resolves.toBe(undefined);
    await expect(storage.read()).resolves.toBe('yo yo yo');
    await storage.purge();
    await expect(storage.read()).resolves.toBe(undefined);
  });
});
