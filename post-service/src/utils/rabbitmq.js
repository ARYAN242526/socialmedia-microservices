import amqp from 'amqplib';
import logger from '../utils/logger.js';

let connection = null;
let channel = null;

const EXCHANGE_NAME = 'socialmedia_events'

async function connectToRabbitMQ(){
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertExchange(EXCHANGE_NAME , 'topic' , {durable: false})
        logger.info('Connected to rabbit mq');
        return channel;
    } catch (e) {
       logger.error('Error connecting to rabbit mq' , e); 
    }
}

export {connectToRabbitMQ}