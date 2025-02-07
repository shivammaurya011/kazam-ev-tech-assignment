import Task from "../models/taskModel.js";
import { sendResponse } from "../utils/responseHandler.js";

// Get all tasks
export const getTasks = async (req, res) => {
    try {
        // Get all task of a user
        const tasks = await Task.find({ user: req.user.id });
        return sendResponse(res, 200, true, "Tasks retrieved successfully", tasks);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// Create task
export const createTask = async (req, res) => {
    try {
        const { name, description, status, dueDate } = req.body;
        // Store task
        const task = await Task.create({ name, description, status, dueDate, user: req.user.id });
        return sendResponse(res, 201, true, "Task created successfully", task);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// Update task
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        // Update task by task id and user id
        const task = await Task.findOneAndUpdate({ _id: id, user: req.user.id }, req.body, { new: true });
        if (!task) return sendResponse(res, 404, false, "Task not found");
        return sendResponse(res, 200, true, "Task updated successfully", task);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

// Delete task
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        // Delete task by task id and user id
        const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
        if (!task) return sendResponse(res, 404, false, "Task not found");
        return sendResponse(res, 200, true, "Task deleted successfully");
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};
