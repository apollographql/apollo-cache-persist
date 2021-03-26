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

  describe('when data is an object', () => {
    it ('writes an object to persistent storage', async () => {
      const obj = {
        yo: 'yo yo'
      }

      await expect(storage.write(obj)).resolves.toBe(undefined);
      await expect(storage.read()).resolves.toBe(obj);
    })
  })  

  describe('when data is a string', () => {
    it ('writes a string to persistent storage', async () => {
      await expect(storage.write('yo yo yo')).resolves.toBe(undefined);
      await expect(storage.read()).resolves.toBe('yo yo yo');
    })
  })
});
