import logger from "../utils/logger.js";
import {Media} from '../models/media.model.js';
import { uploadToCloudinary } from "../utils/cloudinary.js";

const uploadMedia = async(req , res) => {
    logger.info('Starting media upload');
    try {
        // console.log(req.file , "req.filereq.file");
        
        if(!req.file){
            logger.error("No file found! Please add a file and try again");
            return res.status(400).json({
                success : false,
                message : 'No file found! Please add a file and try again'
            })
        }

        const {originalname , mimetype , buffer} = req.file;
        const userId = req.user.userId;

        logger.info(`File details : name=${originalname} , type=${mimetype}`);
        logger.info('Uploading to cloudinary starting...')

        const cloudinaryUploadResult = await uploadToCloudinary(req.file);
        logger.info(`Cloudinary upload successfully. Public Id :- ${cloudinaryUploadResult.public_id}`);

        const newlyCreatedMedia = new Media({
            publicId : cloudinaryUploadResult.public_id,
            originalName : originalname,
            mimeType : mimetype,
            url : cloudinaryUploadResult.secure_url,
            userId,
        });

        await newlyCreatedMedia.save();

        res.status(201).json({
            success : true,
            mediaId : newlyCreatedMedia._id,
            url : newlyCreatedMedia.url,
            message : 'Media uploaded successfully',
        });
    } catch (error) {
        logger.error("Error uploading media" , error);
        res.status(500).json({
            success: false,
            message :"Error uploading media",
        });
    }
}

export {uploadMedia}