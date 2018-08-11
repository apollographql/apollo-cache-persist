import { ApolloCache } from 'apollo-cache';

import onCacheWrite from './onCacheWrite';
import onAppBackground from './onAppBackground';

import Log from './Log';
import Persistor from './Persistor';
import { ApolloPersistOptions, TriggerUninstallFunction } from './types';

export interface TriggerConfig<T> {
  log: Log<T>;
  persistor: Persistor<T>;
}

export default class Trigger<T> {
  debounce: number;
  persistor: Persistor<T>;
  paused: boolean;
  timeout: NodeJS.Timer;
  uninstall: TriggerUninstallFunction;
  cache: ApolloCache<T>;

  static defaultDebounce = 1000;

  constructor(
    { log, persistor }: TriggerConfig<T>,
    options: ApolloPersistOptions<T>
  ) {
    const { defaultDebounce } = Trigger;
    const { cache, debounce, trigger = 'write' } = options;

    if (!trigger) {
      return;
    }

    this.debounce = debounce != null ? debounce : defaultDebounce;
    this.persistor = persistor;
    this.paused = false;
    this.cache = cache;

    switch (trigger) {
      case 'write':
        this.uninstall = this.getDefaultWrite();
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
          this.uninstall = trigger(this.fire, this.getDefaultWrite);
        } else {
          throw Error(`Unrecognized trigger option: ${trigger}`);
        }
    }
  }

  getDefaultWrite = (): (() => void) => {
    return onCacheWrite({ cache: this.cache })(this.fire);
  };

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
