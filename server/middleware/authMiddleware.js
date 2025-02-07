import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/responseHandler.js";

const authMiddleware = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return sendResponse(res, 401, false, "Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return sendResponse(res, 400, false, "Invalid token.");
    }
};

export default authMiddleware;
