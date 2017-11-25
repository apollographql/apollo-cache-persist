export default class Persistor {
  constructor({log, cache, storage}) {
    this.log = log;
    this.cache = cache;
    this.storage = storage;
  }

  async persist() {
    try {
      const data = this.cache.extract();
      await this.storage.write(data);

      this.log.info(
        data.length
          ? `Persisted cache of size ${data.length}`
          : `Persisted cache`
      );
    } catch (error) {
      this.logger.error('Error persisting cache', error);
      throw error;
    }
  }

  async restore() {
    try {
      const data = await this.storage.read();

      if (data != null) {
        await this.cache.restore(data);

        this.log.info(
          data.length
            ? `Restored cache of size ${data.length}`
            : `Restored cache`
        );
      } else {
        this.log.info('No stored cache to restore');
      }
    } catch (error) {
      this.log.error('Error restoring cache', error);
      throw error;
    }
  }

  async purge() {
    try {
      await this.storage.purge();
      this.log.info('Purged cache');
    } catch (error) {
      this.log.error('Error purging cache storage', error);
      throw error;
    }
  }
}
