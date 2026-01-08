import logger from "../utils/logger.js";
import { Post } from "../models/post.model.js";
import { validateCreatePost } from "../utils/validation.js";


const createPost = async(req,res) => {
    logger.info("Create post endpoint hit...");
    try {
        // validate the schema
        const {error} = validateCreatePost(req.body);
        if(error){
            logger.warn("Validation error" , error.details[0].message);
            return res.status(400).json({
                success : false,
                message : error.details[0].message,
            });
        }
        const {content , mediaIds} = req.body;

        const newPost = new Post({
            user : req.user.userId,
            content,
            mediaIds : mediaIds || []
        });

        await newPost.save();

        logger.info("Post created successfully" , newPost);
        return res.status(201).json({
            success : true,
            message : "Post created successfully",
        })
        
    } catch (e) {
        logger.error("Error while creating post" , e);
        res.status(500).json({
            success : false,
            message : "Error creating post",
        });
    }
}

const getAllPosts = async(req,res) => {
    try {
        logger.info("Get all posts endpoint hit...");
        
    } catch (e) {
        logger.error("Error while fetching posts" , e);
        res.status(500).json({
            success : false,
            message : "Error fetching posts",
        });
    }
}

const getPost = async(req,res) => {
    try {
        logger.info("Create post endpoint hit");
        
    } catch (e) {
        logger.error("Error fetching post" , e);
        res.status(500).json({
            success : false,
            message : "Error fetching post by ID",
        });
    }
}

const deletePost = async(req,res) => {
    try {
        logger.info("Delete post endpoint hit...");
        
    } catch (e) {
        logger.error("Error while deleting post" , e);
        res.status(500).json({
            success : false,
            message : "Error deleting post",
        });
    }
}

export {createPost , getAllPosts , getPost , deletePost};