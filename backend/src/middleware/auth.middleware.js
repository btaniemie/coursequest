import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async(req, res, next) => {
    try {
        // get the token
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "Access denied due to no authentication token being found" });

        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find the user
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json({message: "Invalid token"});

        req.user = user;
        next();
    } catch (error) {
        console.log("Authentication error", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

export default protectRoute;