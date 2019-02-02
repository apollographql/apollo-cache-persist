import { PersistedData, EncryptOptions, OnEncryptionError } from './types';
import * as CryptoJS from 'crypto-js';
import { CachePersistor } from '.';

export default class Encryptor<T> {
  _onError?: OnEncryptionError<T>;
  secretKey: string;
  persistor: CachePersistor<T>;

  constructor(persistor: CachePersistor<T>, options: EncryptOptions<T>) {
    if (!options.secretKey) {
      throw new Error(
        'In order to encrypt your Apollo Cache, you need to pass in a secretKey. '
      );
    }

    this._onError = options.onError;
    this.secretKey = options.secretKey;
    this.persistor = persistor;
  }

  encrypt(data: PersistedData<T>): PersistedData<T> {
    return CryptoJS.AES.encrypt(data as string, this.secretKey).toString();
  }

  decrypt(data: PersistedData<T>): PersistedData<T> {
    const bytes = CryptoJS.AES.decrypt(data as string, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  onError(error: Error): void {
    this._onError(error, this.persistor);
  }
}
