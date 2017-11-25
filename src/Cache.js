export default class Cache {
  constructor(options) {
    const {
      cache,
      serialize = true
    } = options;

    this.cache = cache;
    this.serialize = serialize;
  }

  extract() {
    let data = this.cache.extract();

    if (this.serialize) {
      data = JSON.stringify(data);
    }

    return data;
  }

  restore(data) {
    if (this.serialize) {
      data = JSON.parse(data);
    }

    if (data != null) {
      this.cache.restore(data);
    }
  }
}
