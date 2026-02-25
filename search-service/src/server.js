import express from 'express';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import cors from 'cors';
import helmet from 'helmet';
import errorHandler from './middleware/errorHandler.middleware.js';
import logger from './utils/logger.js';
import connectToDB from './db/index.js';
import { connectToRabbitMQ , consumeEvent } from './utils/rabbitmq.js';
import serachRoutes from './routes/search.routes.js';
import { handlePostCreated, handlePostDeleted } from './eventHandlers/search.eventHandler.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 7000;

connectToDB();

const redisClient = new Redis(process.env.REDIS_URL);

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req,res,next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body , ${req.body}`);
    next();
});

app.use('/api/search', serachRoutes);

app.use(errorHandler);

async function startServer() {
    try {
        await connectToRabbitMQ();

        // consume the events / subscribe to the events
        await consumeEvent("post.created" , handlePostCreated);
        await consumeEvent("post.deleted" , handlePostDeleted);

        app.listen(PORT , () => {
            logger.info(`Search service is running on port: ${PORT}`)
        })
    } catch (e) {
        logger.error("Failed to start search service" , e);
        process.exit(1);
    }
}

startServer();