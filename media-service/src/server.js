import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mediaRoutes from './routes/media.routes.js';
import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.middleware.js';
import connectToDB from './db/index.js';
import { connectToRabbitMQ, consumeEvent } from './utils/rabbitmq.js';
import { handlePostDeleted } from './eventHandlers/media.eventHandler.js';

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

async function startServer(){
  try {
        await connectToRabbitMQ();
        
        // consume all the events
        await consumeEvent('post.deleted' , handlePostDeleted)


        app.listen(PORT , () => {
            logger.info(`Media service is running on : ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to connect to server' , error);
        process.exit(1);
    }
}

startServer()
// unhandled promise rejection

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});