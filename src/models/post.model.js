import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true, // Trim whitespace from the name
        minlength: [3, 'Title must be at least 3 characters long'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [100, 'Content must be at least 10 characters long']
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    tags: {
        type: [String],
        default: [],
        trim: true,
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    }
})

// Update updatedAt before saving
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


// Method to soft delete a post
postSchema.methods.softDelete = function() {
  this.deletedAt = Date.now();
  return this.save();
};


// Index for better query performance
postSchema.index({ author: 1, status: 1 });
postSchema.index({ slug: 1 });
postSchema.index({ tags: 1 });


module.exports = mongoose.model('Post', postSchema);