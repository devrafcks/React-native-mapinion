import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        }, 
    caption: {
        type: String,
        required: true,
        },
    image: {
        type: String,
        required: true,
        },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        }
    },
    {timestamps: true}
)

const Post = mongoose.model("Post", postSchema);
export default Post;
