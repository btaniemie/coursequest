import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Course from "../models/Course.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/", protectRoute, async (req, res) => {
    try {
        const {title, caption, rating, image} = req.body;
        if (!image || !title || !caption || !rating) {
            return res.status(500).json({ message: "Please provide all fields" });
        }

        // upload the image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        // save to the database
        const newCourse = new Course({
            title,
            caption,
            rating, 
            image: imageUrl,
            user: req.user._id,
        });

        await newCourse.save();
        res.status(201).json(newCourse)
    } catch (error) {
        console.log("Error creating course", error);
        res.status(500).json({message: error.message});
    }
})

export default router;