export default class Log {
  static buffer = 30;
  static prefix = '[apollo-cache-persist]';

  constructor(options) {
    const {
      debug = false,
    } = options;

    this.debug = debug;
    this.messages = [];
  }

  emit(level, ...message) {
    if (level in console) {
      console[level](this.constructor.prefix, ...message);
    }
  }

  tailLogs() {
    this.messages.forEach(args => this.emit(...args));
  }

  getLogs() {
    return this.messages;
  }

  write(...args) {
    const {buffer} = this.constructor;

    this.messages = [
      ...this.messages.slice(1 - this.constructor.buffer),
      args,
    ];

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
