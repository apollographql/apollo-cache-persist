import { ApolloPersistOptions } from './types';

type Level = 'log' | 'warn' | 'error';

export default class Log<T> {
  debug: boolean;
  messages: string[];

  static buffer = 30;
  static prefix = '[apollo-cache-persist]';

  constructor(options: ApolloPersistOptions<T>) {
    const { debug = false } = options;

    this.debug = debug;
    this.messages = [];
  }

  emit(level: Level, ...message): void {
    if (level in console) {
      console[level]((this.constructor as typeof Log).prefix, ...message);
    }
  }

  tailLogs(): void {
    this.messages.forEach(args => this.emit(...args));
  }

  getLogs(): Array<string[]> {
    return this.messages;
  }

  write(...args) {
    const { buffer } = this.constructor as typeof Log;

    this.messages = [...this.messages.slice(1 - buffer), args];

    const [level] = args;

    if (this.debug || level !== 'log') {
      this.emit(...args);
    }
  }

  info(...message) {
    this.write('log', ...message);
  }

  warn(...message) {
    this.write('warn', ...message);
  }

  error(...message) {
    this.write('error', ...message);
  }
}
