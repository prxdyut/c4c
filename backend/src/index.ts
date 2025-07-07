import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import animalRoutes from './routes/animalRoutes';
import { initializeDatabase } from './config/database';
import { httpLogger } from './middleware/httpLogger';
import logger from './utils/logger';
import path from 'path';

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.OPENAI_API_KEY) {
  logger.error('OPENAI_API_KEY is required in .env file');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  logger.warn('MONGODB_URI not found in .env, using default: mongodb://localhost:27017/openpaws');
}

const app: Express = express();
const port = process.env.PORT || 3005;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: {
    policy: "cross-origin" // Allow images to be served cross-origin
  }
}));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(httpLogger); // Add HTTP request logging

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/animals', animalRoutes);

app.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Test route' });
});

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Open Paws API' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  initializeDatabase().then(() => {
    logger.info('Database initialized successfully');
  }).catch((error) => {
    logger.error('Failed to initialize database:', { error: error instanceof Error ? error.message : 'Unknown error' });
  });
}); 