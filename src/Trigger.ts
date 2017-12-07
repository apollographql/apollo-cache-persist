import onCacheWrite from './onCacheWrite';
import onAppBackground from './onAppBackground';

import Log from './Log';
import Persistor from './Persistor';
import { ApolloPersistOptions } from './types';

interface Config<T> {
  log: Log<T>;
  persistor: Persistor<T>;
}

export default class Trigger<T> {
  debounce: number;
  persistor: Persistor<T>;
  paused: boolean;
  timeout: NodeJS.Timer;
  uninstall: () => void;

  static defaultDebounce = 1000;

  constructor({ log, persistor }: Config<T>, options: ApolloPersistOptions<T>) {
    const { defaultDebounce } = this.constructor as typeof Trigger;

    const { cache, debounce, trigger = 'write' } = options;

    if (!trigger) {
      return;
    }

    this.persistor = persistor;
    this.paused = false;

    switch (trigger) {
      case 'write':
        this.debounce = debounce || defaultDebounce;
        this.uninstall = onCacheWrite({ cache, log })(this.fire);
        break;

      case 'background':
        if (debounce) {
          log.warn('Debounce is not recommended with `background` trigger');
        }
        this.debounce = debounce;
        this.uninstall = onAppBackground({ cache, log })(this.fire);
        break;

      default:
        if (typeof trigger === 'function') {
          this.uninstall = trigger(this.fire);
        } else {
          throw Error(`Unrecognized trigger option: ${trigger}`);
        }
    }
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  remove(): void {
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
