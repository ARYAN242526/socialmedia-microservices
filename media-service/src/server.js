import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mediaRoutes from './routes/media.routes.js';
import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.middleware.js';
import connectToDB from './db/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000

connectToDB();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

app.use('/api/media' , mediaRoutes);

app.use(errorHandler);

app.listen(PORT , () => {
    logger.info(`Media service running on port : ${PORT}`);
})

// unhandled promise rejection

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});