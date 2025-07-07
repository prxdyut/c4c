import winston, { Logger } from 'winston';
import path from 'path';

interface LogInfo {
    timestamp: string;
    level: string;
    message: string;
}

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define different colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

// Tell winston that we want to link specific colors with specific log levels
winston.addColors(colors);

// Define which logs we want to show based on the environment
const level = (): string => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'warn';
};

// Custom format for logging
const format = winston.format.combine(
    // Add timestamp
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // Add colors
    winston.format.colorize({ all: true }),
    // Define the format of the message showing the timestamp, the level and the message
    winston.format.printf(
        (info) => `${info.timestamp as string} ${info.level}: ${info.message}`,
    ),
);

// Define which transports we want to use for our logger
const transports = [
    // Allow the use the console to print the messages
    new winston.transports.Console(),
    // Allow to print all the error level messages inside the error.log file
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    // Allow to print all the messages inside the all.log file
    new winston.transports.File({ filename: 'logs/all.log' }),
];

// Create the logger instance
const logger: Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

export default logger; 