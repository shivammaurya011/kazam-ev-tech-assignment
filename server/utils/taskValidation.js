import Joi from "joi";

export const taskValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        "string.empty": "Task name is required.",
        "string.min": "Task name must be at least 3 characters long.",
        "string.max": "Task name must not exceed 50 characters.",
    }),
    description: Joi.string().min(5).max(200).required().messages({
        "string.empty": "Description is required.",
        "string.min": "Description must be at least 5 characters long.",
        "string.max": "Description must not exceed 200 characters.",
    }),
    status: Joi.string()
        .valid("pending", "ongoing", "completed")
        .required()
        .messages({ "any.only": "Status must be 'pending', 'ongoing', or 'completed'." }),
    dueDate: Joi.date().greater("now").required().messages({
        "date.base": "Invalid date format.",
        "date.greater": "Due date must be in the future.",
    }),
});
