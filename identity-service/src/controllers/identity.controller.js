import logger from "../utils/logger.js";
import { User } from "../models/user.model.js";
import { validateRegistration } from "../utils/validation.js";
import { generateTokens } from "../utils/generateTokens.js";


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
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        // another way to do above mentioned code
        // user = new User({username , email , password});
        // await user.save()

        logger.warn("User created successfully" , newUser._id);

        const {accessToken , refreshToken} = await generateTokens(user);

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


export {registerUser}