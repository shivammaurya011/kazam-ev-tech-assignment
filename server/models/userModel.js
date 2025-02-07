import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
        },
        password: {
            type: String,
            required: true,
        },
        tasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Generate auth token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d",
    });
};

// Verify auth token
userSchema.statics.verifyAuthToken = function (token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!enteredPassword) return false; 
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
