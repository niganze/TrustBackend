// controllers/teamController.js
import Team from '../models/TeamModel.js';
import { AppError } from '../utils/errorHandler.js';

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getTeamMembers = async (req, res, next) => {
  try {
    const members = await Team.find();

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
export const getTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);

    if (!member) {
      return next(new AppError(`No team member found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create team member
// @route   POST /api/team
// @access  Private
export const createTeamMember = async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    
    // Create the team member object from the request body
    const teamMemberData = {
      name: req.body.name,
      role: req.body.role,
      description: req.body.description
    };
    
    // Add the image URL if a file was uploaded
    if (req.file && req.file.path) {
      teamMemberData.images = req.file.path;
    }
    
    // Create the team member in the database
    const newTeamMember = await Team.create(teamMemberData);
    
    res.status(201).json({
      success: true,
      data: newTeamMember
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    next(new AppError(error.message, 400));
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private
export const updateTeamMember = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    
    // Handle image file if updated with multer
    if (req.file && req.file.path) {
      updateData.images = req.file.path;
    }
    
    const member = await Team.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!member) {
      return next(new AppError(`No team member found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private
export const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);

    if (!member) {
      return next(new AppError(`No team member found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};