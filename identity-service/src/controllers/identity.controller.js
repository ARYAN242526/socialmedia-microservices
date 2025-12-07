import logger from "../utils/logger.js";
import { User } from "../models/user.model.js";
import { validateLogin, validateRegistration } from "../utils/validation.js";
import { generateTokens } from "../utils/generateTokens.js";
import { Logger } from "winston";


// user registration
const registerUser = async(req,res) => {
    logger.info("Registration endpoint hit");

    try {
        // validate the schema
        const {error} = validateRegistration(req.body);
        if(error) {
            logger.warn("Validation error" , error.details[0].message);
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const {username , email , password} = req.body;

        const user = await User.findOne({ $or : [{username} , {email}]})
        if(user){
            logger.warn("User already exists");
            return res.status(400).json({
                success: false,
                message : "User already exists"
            });
        }

        const newUser = await User.create({
            username,
            email,
            password,
        });

        // another way to do above mentioned code
        // user = new User({username , email , password});
        // await user.save()

        logger.warn("User created successfully" , newUser._id);

        const {accessToken , refreshToken} = await generateTokens(newUser);

        res.status(201).json({
            success : true,
            message: "User registered successfully",
            accessToken,
            refreshToken
        });
    } catch (e) {
        logger.error("registration error occured" , e);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// user login
const loginUser = async(req,res) => {
    logger.info("Login endpoint hit...");

    try {
        const {error} = validateLogin(req.body);
        if(error){
            logger.warn("Validation error" , error.details[0].message);
            return res.status(400).json({
                success : false,
                message: error.details[0].message,
            });
        }

        const {email , password} = req.body;
        const user = await User.findOne({email}); 

        if(!user){
            logger.warn("Invalid user");
            return res.status(400).json({
                success: false,
                message: "invalid credentials",
            });
        }

        // user valid password or not
        const isValidPassword = await user.comparePassword(password);
        if(!isValidPassword){
            logger.warn("Invalid password");
            return res.status(400).json({
                success: false,
                message : "Invalid password",
            });
        }

        const {accessToken , refreshToken} = await generateTokens(user);

        return res.status(201).json({
            success : true,
            accessToken,
            refreshToken,
            userId : user._id,
            message : "User login successful"
        });
    
    } catch (e) {
        logger.error("Login error occured" , e);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
} 

export {registerUser , loginUser}