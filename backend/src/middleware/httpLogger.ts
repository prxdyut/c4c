import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const httpLogger = (req: Request, res: Response, next: NextFunction): void => {
    // Start timer
    const start = Date.now();

    // Log when the request completes
    res.on('finish', () => {
        // Calculate processing time
        const duration = Date.now() - start;

        // Create log message
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
        
        // Log with appropriate level based on status code
        if (res.statusCode >= 500) {
            logger.error(message);
        } else if (res.statusCode >= 400) {
            logger.warn(message);
        } else {
            logger.http(message);
        }

        // Log request body for non-GET requests (excluding file uploads and sensitive data)
        if (req.method !== 'GET' && !req.is('multipart/form-data')) {
            const sanitizedBody = { ...req.body };
            // Remove sensitive fields
            delete sanitizedBody.password;
            delete sanitizedBody.token;
            delete sanitizedBody.apiKey;
            
            logger.debug(`Request body: ${JSON.stringify(sanitizedBody)}`);
        }
    });

    next();
}; 