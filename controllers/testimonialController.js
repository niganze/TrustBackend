import Testimonial from '../models/Testimonial.js';
import { AppError } from '../utils/errorHandler.js';

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res, next) => {
  try {
    let query;
    
    // Get only featured testimonials if featured=true in query
    if (req.query.featured === 'true') {
      query = Testimonial.find({ featured: true }).sort('order');
    } else {
      query = Testimonial.find().sort('order');
    }
    
    const testimonials = await query;
    
    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
export const getTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return next(new AppError(`No testimonial found with id ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = async (req, res, next) => {
  try {
    // Add image if uploaded
    if (req.file) {
      req.body.image = `/${req.file.path}`;
    }
    
    const testimonial = await Testimonial.create(req.body);
    
    res.status(201).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req, res, next) => {
  try {
    // Add image if uploaded
    if (req.file) {
      req.body.image = `/${req.file.path}`;
    }
    
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!testimonial) {
      return next(new AppError(`No testimonial found with id ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    
    if (!testimonial) {
      return next(new AppError(`No testimonial found with id ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};