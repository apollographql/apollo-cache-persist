import { PersistedData, EncryptOptions, OnEncryptionError } from './types';
import * as CryptoJS from 'crypto-js';

export default class Encryptor<T> {
  onError?: OnEncryptionError;
  secretKey: string;

  constructor(options: EncryptOptions) {
    if (!options.secretKey) {
      throw new Error(
        'In order to encrypt your Apollo Cache, you need to pass in a secretKey. '
      );
    }

    this.onError = options.onError;
    this.secretKey = options.secretKey;
  }

  encrypt(data: PersistedData<T>): PersistedData<T> {
    return CryptoJS.AES.encrypt(data as string, this.secretKey).toString();
  }

  decrypt(data: PersistedData<T>): PersistedData<T> {
    const bytes = CryptoJS.AES.decrypt(data as string, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
