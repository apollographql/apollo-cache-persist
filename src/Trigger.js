import onCacheWrite from './onCacheWrite';
import onAppBackground from './onAppBackground';

export default class Trigger {
  static defaultDebounce = 1000;

  constructor({log, persistor}, options) {
    const {defaultDebounce} = this.constructor;

    const {
      cache,
      debounce,
      trigger = 'write',
    } = options;

    if (!trigger) {
      return;
    }

    this.persistor = persistor;
    this.paused = false;

    switch (trigger) {
      case 'write':
        this.debounce = debounce === undefined ? defaultDebounce : 0;
        this.uninstall = onCacheWrite({cache, log})(this.fire);
        break;

      case 'background':
        if (debounce) {
          log.warn('Debounce is not recommended with `background` trigger');
        }
        this.debounce = debounce;
        this.uninstall = onAppBackground({cache, log})(this.fire);
        break;

      default:
        if (typeof trigger === 'function') {
          this.uninstall = trigger(this.fire);
        } else {
          throw Error(`Unrecognized trigger option: ${trigger}`);
        }
    }
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  remove() {
    if (this.uninstall) {
      this.uninstall();
      this.uninstall = null;
      this.paused = true;
    }
  }

  fire = () => {
    if (!this.debounce) {
      this.persist();
      return;
    }

    if (this.timeout != null) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(this.persist, this.debounce);
  };

  persist = () => {
    if (this.paused) {
      return;
    }

    this.persistor.persist();
  };
}
