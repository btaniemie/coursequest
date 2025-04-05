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
});

router.get("/", protectRoute, async(req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const courses = await Course.find()
        .sort({ createdAt: -1 }) // descending order (show latest posts at the top)
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage"); 
        
        const totalCourses = Course.countDocuments();
        res.send({
            courses,
            currentPage: page,
            totalCourses,
            totalPages: Math.ceil(totalCourses / limit),
        });
    } catch (error) {
        console.log("Error in getting all courses route", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router;