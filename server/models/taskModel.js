import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    status:{
        enum: ["pending", "ongoing", "completed"],
        type: String,
        required: true,
        default: "pending",
    },
    dueDate:{
        type: Date,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
});

// Task name unique for each user
taskSchema.index({name: 1, user: 1}, {unique: true});

// dewDate validation
taskSchema.path("dueDate").validate(function(value) {
    const currentDate = new Date();
    return value >= currentDate;
}, "Due date cannot be in the past");

const Task = mongoose.model("Task", taskSchema);

export default Task;