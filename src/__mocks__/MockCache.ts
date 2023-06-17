import Cache from '../Cache';
import { ApolloPersistOptions, PersistedData } from '../types';

export default class MockCache<T, U extends boolean = true>
  implements Cache<T>
{
  cache: null;
  serialize: boolean;
  data: PersistedData<T>;

  constructor(options: Pick<ApolloPersistOptions<T, U>, 'serialize'>) {
    const { serialize = true } = options;
    this.serialize = serialize;
  }

  extract(): PersistedData<T> {
    let data: PersistedData<T> = this.data;

    if (this.serialize) {
      data = JSON.stringify(this.data) as string;
    }

    return data;
  }

  restore(data: PersistedData<T>): void {
    if (this.serialize && typeof data === 'string') {
      data = JSON.parse(data);
    }

    if (data != null) {
      this.data = data;
    }
  }
}
