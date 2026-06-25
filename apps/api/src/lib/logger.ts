import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: 'akrdev-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
          const metaStr = Object.keys(meta).length > 1 ? ` ${JSON.stringify(meta)}` : ''
          if (stack) {
            return `${timestamp} [${level}]: ${message}\n${stack}${metaStr}`
          }
          return `${timestamp} [${level}]: ${message}${metaStr}`
        }),
      ),
    }),
  ],
})

export default logger
