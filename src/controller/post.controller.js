import slugify from 'slugify';
import {Post} from '../models/post.model.js';
import generateUniqueSlug from '../utils/generateSlug.js';



// POST - Create post (auth required) 
// /api/posts
export const createPost = async (req, res, next) => {
  // Check if user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required to create a post'
    });
  }

  const { title, content, status, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Title and content are required'
    });
  }

  const baseSlug = generateUniqueSlug(title, "Post")

  const post = await Post.create({
    title,
    slug: baseSlug,
    content,
    tags,
    status: status || 'draft',
    author: req.user.id
  });

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: post
  });
};


// DELETE - Soft delete (author only) 
// /api/posts/:id  
export const deletePost = async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findOne({ _id: id, deletedAt: null });

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Check if user is the author
  if (post.author.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this post'
    });
  }

  // Soft delete
  await post.softDelete();

  res.status(200).json({
    success: true,
    message: 'Post deleted successfully',
    data: {}
  });
};


// GET - Get single published post 
// /api/posts/:slug 
export const getPost = async (req, res, next) => {
    
    const { slug } = req.params;  // Not 'id', it's 'slug'
  
    const post = await Post.findOne({ 
        slug: slug, 
        status: 'published',
        deletedAt: null 
    })
        .populate('author', 'name email');
    
    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Post not found'
        });
    }
  
    res.status(200).json({
        success: true,
        data: post
    });
};

// PUT - Update post (author only) 
// /api/posts/:id  
export const updatePost = async (req, res, next) => {
  const { id } = req.params;
  const { title, content, status, tags } = req.body;

  let post = await Post.findOne({ _id: id, deletedAt: null });

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }

  // Check if user is the author
  if (post.author.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this post'
    });
  }

  // Update fields
  if (title) {
    post.title = title;
    // If title changes, regenerate slug
    post.slug = await generateUniqueSlug(title, "Post");
  }
  if (content) post.content = content;
  if (status) post.status = status;
  if (tags) post.tags = tags;

  await post.save();

  res.status(200).json({
    success: true,
    message: 'Post updated successfully',
    data: post
  });
};


// GET - Public posts (published only) with pagination 
// /api/posts 
export const getPosts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const { skip, limit: paginationLimit } = paginate(page, limit);
  
  // Get published posts only (public)
  const posts = await Post.find({ 
    status: 'published', 
    deletedAt: null 
  })
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(paginationLimit);
  
  // Get total count for pagination metadata
  const total = await Post.countDocuments({ 
    status: 'published', 
    deletedAt: null 
  });
  
  res.status(200).json({
    success: true,
    data: posts,
    pagination: {
      page,
      limit: paginationLimit,
      total,
      totalPages: Math.ceil(total / paginationLimit)
    }
  });
};


// GET - Posts with filters (search, tag, author, status) with pagination
// /api/posts?search=keyword&tag=tagname&author=authorname&status=published
export const getPostsWithFilter = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { search, tag, author, status } = req.query;
  
  const { skip, limit: paginationLimit } = paginate(page, limit);
  
  // Build query object
  const query = { deletedAt: null };
  
  // Status filter - only for authenticated users
  if (status) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to filter by status'
      });
    }
    query.status = status;
  } else {
    // For non-authenticated users or when status not specified, show only published
    query.status = 'published';
  }
  
  // Search filter (title or content)
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }
  
  // Tag filter
  if (tag) {
    query.tags = tag.toLowerCase();
  }
  
  // Author filter
  if (author) {
    query.author = author;
  }
  
  // Get posts with filters
  const posts = await Post.find(query)
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(paginationLimit);
  
  // Get total count for pagination metadata
  const total = await Post.countDocuments(query);
  
  res.status(200).json({
    success: true,
    data: posts,
    pagination: {
      page,
      limit: paginationLimit,
      total,
      totalPages: Math.ceil(total / paginationLimit)
    }
  });
};