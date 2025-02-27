import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized access." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) return res.status(401).json({ message: "User not found." });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
