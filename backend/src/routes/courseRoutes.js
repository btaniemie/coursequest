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
});

// get the courses the authenticated user has recommended in the past
router.get("/User", protectRoute, async(req, res) => {
    try {
        const courses = await Course.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(courses);
    } catch (error) {
        console.error("Error in getting past recommendations by authenticated user", error.message);
        res.status(500).json({ message: "Internal server erorr"});
    }
})

router.delete("/:id", protectRoute, async(req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({message: "Course not found"});

        // check if user created this recommendation
        if (course.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: "Unauthorized. You cannot delete a post you did not create"});
        };

        // delete user's avatar from cloudinary
        if (course.image && course.image.includes("cloudinary")) {
            try {
                const publicId = course.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.log("Error in deleting avatar from cloudinary", error);
            }
        }
        
        await course.deleteOne();
        res.json({message: "Course recommendation deleted successfully"});
    } catch (error) {
        console.log("Error in deleting course recommendation", error);
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;