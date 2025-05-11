import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import Post from '../models/Post.js';
import protectRoute from '../middleware/auth.md.js';

const router = express.Router();

router.post("/", protectRoute ,async (req, res) => {
    try {
        const { title, caption, image, rating } = req.body;

        if (!title || !caption || !image || !rating) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const uploadResponse = await cloudinary.uploader.upload(image)
        const imageUrl = uploadResponse.secure_url;

        const newPost = new Post({
            title,
            caption,
            image: imageUrl,
            rating,
            user: req.user._id 
        });

        await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: newPost });

    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }

})

router.get("/", protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("user", "username profilePicture");
        if (!posts) {
            return res.status(404).json({ message: "No posts found" });
        }
        
        const totalPosts = await Post.countDocuments();

        res.send({
            posts, 
            currentPage: page, 
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit)}
        );
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/user", protectRoute, async (req, res) => {
    try {
        const userPosts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json(userPosts);
    } catch (error) {
        console.error("Get user posts error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/:id", protectRoute, async (req, res) => {
    try {
        const { title, caption, image, rating } = req.body;

        if (!title || !caption || !image || !rating) {
        return res.status(400).json({ message: "All fields are required" });
        }

        if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
        return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to update this post" });
        }

        let updatedImageUrl = post.image;

        
        if (image !== post.image) {

        if (post.image && post.image.includes("cloudinary")) {
            const oldPublicId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(oldPublicId);
        }

        const uploadResponse = await cloudinary.uploader.upload(image);
        updatedImageUrl = uploadResponse.secure_url;
        }

        post.title = title;
        post.caption = caption;
        post.rating = rating;
        post.image = updatedImageUrl;

        await post.save();

        res.status(200).json({ message: "Post updated successfully", post });

    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        // Delete the image from Cloudinary
        if (post.image && post.image.includes("cloudinary")) {
            try {
                const publicId = post.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
                console.log("Image deleted from Cloudinary successfully");

            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
                return res.status(500).json({ message: "Error deleting image from Cloudinary" });
            }
        }

        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        
    }
})

export default router;