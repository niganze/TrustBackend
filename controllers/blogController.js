import Blog from '../models/Blog.js';
import { AppError } from '../utils/errorHandler.js';
import mongoose from 'mongoose';

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
export const getBlogPosts = async (req, res, next) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // For now, show all posts (both published and unpublished)
    // Later you can add authentication check here
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Find resources
    query = Blog.find(JSON.parse(queryStr));
    
    // Optional populate - only if author field exists in the schema
    try {
      query = query.populate({
        path: 'author',
        select: 'name'
      });
    } catch (err) {
      // If populate fails, continue without it
      console.log('Could not populate author, continuing without population');
    }
    
    // Filter by category if provided
    if (req.query.category) {
      query = query.where('category').equals(req.query.category);
    }
    
    // Filter by tags if provided
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query = query.where('tags').in(tags);
    }
    
    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Blog.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const blogs = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog post
// @route   GET /api/blog/:id
// @access  Public
export const getBlogPost = async (req, res, next) => {
  try {
    let blog;
    
    try {
      blog = await Blog.findById(req.params.id);
      
      // Optional populate - only if author field exists in the schema
      try {
        blog = await Blog.findById(req.params.id).populate({
          path: 'author',
          select: 'name'
        });
      } catch (err) {
        // If populate fails, continue without it
        console.log('Could not populate author, continuing without population');
      }
    } catch (err) {
      return next(new AppError(`No blog post found with id ${req.params.id}`, 404));
    }
    
    if (!blog) {
      return next(new AppError(`No blog post found with id ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new blog post
// @route   POST /api/blog
// @access  Public (will be changed to Private later)
export const createBlogPost = async (req, res, next) => {
  try {
    // Don't set author for now - you'll add this with authentication later
    // req.body.author = req.user.id;
    
    // Add image if uploaded
    if (req.file) {
      req.body.image = `/${req.file.path}`;
    }
    
    // Convert tags string to array if provided
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
    }
    
    // Set published date if post is published
    if (req.body.published) {
      req.body.publishedAt = Date.now();
    }
    
    const blog = await Blog.create(req.body);
    
    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Public (will be changed to Private later)
export const updateBlogPost = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return next(new AppError(`No blog post found with id ${req.params.id}`, 404));
    }
    
    // Skip authentication check for now
    // Will add this back when you implement authentication
    
    // Add image if uploaded
    if (req.file) {
      req.body.image = `/${req.file.path}`;
    }
    
    // Convert tags string to array if provided
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
    }
    
    // Set published date if post is being published for the first time
    if (req.body.published && !blog.published) {
      req.body.publishedAt = Date.now();
    }
    
    // Update the updatedAt field
    req.body.updatedAt = Date.now();
    
    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Public (will be changed to Private later)
export const deleteBlogPost = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return next(new AppError(`No blog post found with id ${req.params.id}`, 404));
    }
    
    // Skip authentication check for now
    // Will add this back when you implement authentication
    
    await Blog.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by category
// @route   GET /api/blog/category/:categoryName
// @access  Public
export const getBlogPostsByCategory = async (req, res, next) => {
  try {
    const category = req.params.categoryName;
    
    const query = {
      category
      // Will add published check later with authentication
    };
    
    const blogs = await Blog.find(query)
      .sort('-createdAt');
    
    // Optional populate - only if author field exists in the schema
    try {
      const blogs = await Blog.find(query)
        .populate({
          path: 'author',
          select: 'name'
        })
        .sort('-createdAt');
        
      res.status(200).json({
        success: true,
        count: blogs.length,
        data: blogs
      });
      return;
    } catch (err) {
      // If populate fails, continue without it
      console.log('Could not populate author, continuing without population');
    }
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by tag
// @route   GET /api/blog/tag/:tagName
// @access  Public
export const getBlogPostsByTag = async (req, res, next) => {
  try {
    const tag = req.params.tagName;
    
    const query = {
      tags: { $in: [tag] }
      // Will add published check later with authentication
    };
    
    const blogs = await Blog.find(query)
      .sort('-createdAt');
    
    // Optional populate - only if author field exists in the schema
    try {
      const blogs = await Blog.find(query)
        .populate({
          path: 'author',
          select: 'name'
        })
        .sort('-createdAt');
        
      res.status(200).json({
        success: true,
        count: blogs.length,
        data: blogs
      });
      return;
    } catch (err) {
      // If populate fails, continue without it
      console.log('Could not populate author, continuing without population');
    }
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle publish status
// @route   PUT /api/blog/:id/publish
// @access  Public (will be changed to Private later)
export const togglePublishStatus = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return next(new AppError(`No blog post found with id ${req.params.id}`, 404));
    }
    
    // Skip authentication check for now
    // Will add this back when you implement authentication
    
    // Toggle publish status
    blog.published = !blog.published;
    
    // Set publishedAt if being published for the first time
    if (blog.published && !blog.publishedAt) {
      blog.publishedAt = Date.now();
    }
    
    blog.updatedAt = Date.now();
    
    await blog.save();
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};