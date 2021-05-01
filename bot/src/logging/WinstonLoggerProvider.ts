import winston from 'winston';
import util from 'util';
import { LoggerProvider, Logger, LogLevel } from './LoggerProvider';

const winstonLogLevelMapping: Record<LogLevel, string> = {
    [LogLevel.TRACE]: 'silly',
    [LogLevel.DEBUG]: 'debug',
    [LogLevel.INFO]: 'info',
    [LogLevel.WARN]: 'warn',
    [LogLevel.ERROR]: 'error',
};

export class WinstonLoggerProvider implements LoggerProvider {
    private _logLevel: LogLevel;

    constructor(options: { logLevel: LogLevel }) {
        this._logLevel = options.logLevel;
    }

    create(label: string): Logger {
        return new WinstonLogger(winston.createLogger({
            level: winstonLogLevelMapping[this._logLevel],
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.label({ label }),
                winston.format.printf(info => `[${info.timestamp}] [${info.label}] [${info.level}] ${info.message}`)
            ),
            transports: [new winston.transports.Console()],
        }));
    }
}

class WinstonLogger implements Logger {
    private _logger: winston.Logger;

    constructor(logger: winston.Logger) {
        this._logger = logger;
    }

    trace(...args: unknown[]) {
        this._logger.silly(this._format(args));
    }

    debug(...args: unknown[]) {
        this._logger.debug(this._format(args));
    }

    info(...args: unknown[]) {
        this._logger.info(this._format(args));
    }

    warn(...args: unknown[]) {
        this._logger.warn(this._format(args));
    }

    error(...args: unknown[]) {
        this._logger.error(this._format(args));
    }

    private _format(args: unknown[]) {
        return args.map(arg => util.formatWithOptions({ colors: true, depth: 10, breakLength: 120 }, arg)).join(' ');
    }
}
