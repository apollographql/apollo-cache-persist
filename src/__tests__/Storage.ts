import MockStorage from '../__mocks__/MockStorage';
import Storage from '../Storage';

describe('Storage', () => {
  const storage = new Storage({
    storage: new MockStorage(),
  });

  it('writes data to persistent storage', async () => {
    await expect(storage.write('yo yo yo')).resolves.toBe(undefined);
  });

  it('reads data from persistent storage', async () => {
    await expect(storage.read()).resolves.toBe('yo yo yo');
  });
});
