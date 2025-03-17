import Project from '../models/Project.js';
import cloudinary from '../config/cloudinary.js';

export const createProject = async (req, res) => {
  try {
    const { title, description, timeline, budget, owner, category } = req.body;
    console.log('REQ FILES:', req.files);
    console.log('REQ BODY:', req.body);

    let imageUrl = '';
    if (req.files && req.files.image && req.files.image[0]) {
      console.log('Uploading main image to Cloudinary...');
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: 'projects/main',
      });
      imageUrl = result.secure_url;
    } else {
      console.log('No main image found');
      return res.status(400).json({
        status: 'error',
        message: 'Main image is required.',
      });
    }

    const galleryImages = [];
    if (req.files && req.files.gallery) {
      console.log('Uploading gallery images...');
      const galleryFiles = req.files.gallery;
      for (const file of galleryFiles) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'projects/gallery',
        });
        galleryImages.push(result.secure_url);
      }
    }

    const newProject = new Project({
      title,
      description,
      timeline,
      budget,
      owner,
      category,
      image: imageUrl,
      gallery: galleryImages,
    });

    console.log('Saving project:', newProject);
    await newProject.save();

    res.status(201).json({
      status: 'success',
      data: newProject,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error, unable to create project.',
      error: error.message, // Optional, for debugging
    });
  }
};


export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json({
      status: 'success',
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error, unable to fetch projects.',
      error: error.message,
    });
  }
};

// Get Single Project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: `No project found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: project,
    });
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error, unable to fetch project.',
      error: error.message,
    });
  }
};

// Update Project
export const updateProject = async (req, res) => {
  try {
    const { title, description, timeline, budget, owner, category } = req.body;

    const updatedData = { title, description, timeline, budget, owner, category };

    // Main image update
    if (req.files && req.files.image && req.files.image[0]) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: 'projects/main',
      });
      updatedData.image = result.secure_url;
    }

    // Gallery images update
    if (req.files && req.files.gallery) {
      const galleryFiles = req.files.gallery;
      const galleryImages = [];

      for (const file of galleryFiles) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'projects/gallery',
        });
        galleryImages.push(result.secure_url);
      }

      updatedData.gallery = galleryImages;
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return res.status(404).json({
        status: 'error',
        message: `No project found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      status: 'success',
      data: updatedProject,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error, unable to update project.',
      error: error.message,
    });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: `No project found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully!',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error, unable to delete project.',
      error: error.message,
    });
  }
};