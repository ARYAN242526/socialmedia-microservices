import express from 'express';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import cors from 'cors';
import helmet from 'helmet';
import postRoutes from './routes/post.routes.js';
import errorHandler from './middleware/errorHandler.middleware.js';
import logger from './utils/logger.js';
import connectToDB from './db/index.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

app.use('/api/posts' , (req,res,next) => {
    req.redisClient = redisClient;
    next();
} , postRoutes);

app.use(errorHandler);

app.listen(PORT , () => {
    logger.info(`Post service is running on : ${PORT}`);
});

// unhandled promise rejection
process.on('unhandledRejection' , (reason , promise) => {
    logger.error("Unhandled Rejection at" , promise , "reason:" , reason);
});

