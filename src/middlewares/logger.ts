import winston from 'winston';
import 'winston-daily-rotate-file';

const requestLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.DailyRotateFile({ filename: 'logs/request-%DATE%.log', datePattern: 'YYYY-MM-DD' }),
  ],
});

const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.DailyRotateFile({ filename: 'logs/error-%DATE%.log', datePattern: 'YYYY-MM-DD' }),
  ],
});

export { requestLogger, errorLogger };
