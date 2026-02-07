import mongoose from 'mongoose';
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 4 characters long'],
        maxlength: [20, 'Name must be no more than 20 characters long'],
        match: [/^[a-zA-Z]+$/, 'Name can only contain letters.']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'User already exists'],
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Must be a valid email address with format "name@gmail.com - schema"']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },

}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
