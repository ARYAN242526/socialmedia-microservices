import { Media } from "../models/media.model.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import logger from "../utils/logger.js";


const handlePostDeleted = async (event) => {
    console.log(event , "eventHandled");
    const {postId , mediaIds} = event

    try {
        const mediaToDelete = await Media.find({_id : {$in : mediaIds} })

        for(const media of mediaToDelete){
            await deleteFromCloudinary(media.publicId)
            await Media.findByIdAndDelete(media._id)

            logger.info(`Deleted media ${media._id} associated with this deleted post ${postId}`);
        }

        logger.info(`Processed deletion of media for post id ${postId}`)
    } catch (err) {
        logger.error("Error occured while deleting media" , err)
    }
}

export {handlePostDeleted}