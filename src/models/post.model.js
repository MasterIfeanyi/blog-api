import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true, // Trim whitespace from the name
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },

})


module.exports = mongoose.model('Post', postSchema);