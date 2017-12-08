import { ApolloPersistOptions, LogLevel, LogLine } from './types';

export default class Log<T> {
  debug: boolean;
  lines: Array<LogLine>;

  static buffer = 30;
  static prefix = '[apollo-cache-persist]';

  constructor(options: ApolloPersistOptions<T>) {
    const { debug = false } = options;

    this.debug = debug;
    this.lines = [];
  }

  emit(level: LogLevel, message: any[]): void {
    if (level in console) {
      const { prefix } = Log;
      console[level](prefix, ...message);
    }
  }

  tailLogs(): void {
    this.lines.forEach(([level, message]) => this.emit(level, message));
  }

  getLogs(): Array<LogLine> {
    return this.lines;
  }

  write(level: LogLevel, message: any[]): void {
    const { buffer } = Log;

    this.lines = [...this.lines.slice(1 - buffer), [level, message]];

    if (this.debug || level !== 'log') {
      this.emit(level, message);
    }
  }

  info(...message: any[]): void {
    this.write('log', message);
  }

  warn(...message: any[]): void {
    this.write('warn', message);
  }

  error(...message: any[]): void {
    this.write('error', message);
  }
}
