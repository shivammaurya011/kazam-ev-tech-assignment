import User from "../models/userModel.js";
import { sendResponse } from "../utils/responseHandler.js";
const isProduction = process.env.NODE_ENV === 'production';

// Register controller
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendResponse(res, 400, false, "User already exists");
        }

        // Create new user
        const user = new User({ name, email, password });
        await user.save();

        return sendResponse(res, 201, true, "User created successfully", user);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// Login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return sendResponse(res, 404, false, "User not found");
        }

        // Check if password is correct
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return sendResponse(res, 401, false, "Invalid credentials");
        }

        // Generate auth token
        const token = user.generateAuthToken();

        // Set token in cookie with security options
        res.cookie("token", token, { httpOnly: true, secure: isProduction, sameSite: "strict" });

        return sendResponse(res, 200, true, "User logged in successfully", { user, token });
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// Logout controller
export const logout = async (req, res) => {
    try {
        // Clear cookie
        res.clearCookie("token");
        return sendResponse(res, 200, true, "User logged out successfully");
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// Verify controller
export const verify = async (req, res) => {
    try {
      const token = req.cookies.token;
  
      if (!token) {
        return sendResponse(res, 401, false, 'Unauthorized');
      }
  
      const decoded = User.verifyAuthToken(token);
      if (!decoded) {
        return sendResponse(res, 401, false, 'Invalid or expired token');
      }
  
      const user = await User.findById(decoded.id).select('-password').populate('tasks');
      if (!user) {
        return sendResponse(res, 404, false, 'User not found');
      }
  
      return sendResponse(res, 200, true, 'User verified', user);
    } catch (error) {
      return sendResponse(res, 500, false, error.message);
    }
  };
