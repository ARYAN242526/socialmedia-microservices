import mongoose from "mongoose";
import logger from "../utils/logger.js";
// import dotenv from 'dotenv';

// dotenv.config();

const connectToDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        logger.info(`MongoDB connected ! DB Host : ${connectionInstance.connection.host}`);
    } catch (error) {
        logger.error("MONGODB connection failed" , error);
        process.exit(1);
    }
}

export default connectToDB;