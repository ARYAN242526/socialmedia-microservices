import express from 'express';
import dotenv from 'dotenv';
import Redis from 'ioredis';
import cors from 'cors';
import helmet from 'helmet';

import errorHandler from './middleware/errorHandler.middleware.js';
import logger from './utils/logger.js';
import connectToDB from './db/index.js';
import { connectToRabbitMQ } from './utils/rabbitmq.js';


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