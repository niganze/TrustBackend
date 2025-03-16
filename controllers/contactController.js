import Contact from '../models/Contact.js';
import { AppError } from '../utils/errorHandler.js';
import { sendEmail } from '../utils/emailService.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, message, phone } = req.body;

    // 1. Save the contact form to the database
    const contact = await Contact.create(req.body);

    // 4. Respond to the client
    res.status(201).json({
      success: true,
      data: contact,
      message: 'Contact submitted successfully!'
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};


// @desc    Get all contacts
// @route   GET /api/contact
// @access  Private/Admin
export const getContacts = async (req, res, next) => {
  try {
    let query;
    
    // Filter by status if provided
    if (req.query.status) {
      query = Contact.find({ status: req.query.status }).sort('-createdAt');
    } else {
      query = Contact.find().sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Contact.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const contacts = await query;
    
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
      count: contacts.length,
      pagination,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return next(new AppError(`No contact found with id ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!contact) {
      return next(new AppError(`No contact found with id ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return next(new AppError(`No contact found with id ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};