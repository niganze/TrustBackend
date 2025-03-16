import Project from '../models/Project.js';
import cloudinary from '../config/cloudinary.js';

export const createProject = async (req, res) => {
  try {
    const { title, description, client, category, tags, size, budget, duration, teamSize, testimonial, timeframe, completionDate } = req.body;

    // Handling the main project image upload (if any)
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'projects',
      });
      imageUrl = result.secure_url;
    }

    // Handling multiple gallery images (if any)
    const galleryImages = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'projects/gallery',
        });
        galleryImages.push(result.secure_url);
      }
    }

    const newProject = new Project({
      title,
      description,
      client,
      category,
      tags,
      image: imageUrl,
      images: galleryImages,
      size,
      budget,
      duration,
      teamSize,
      testimonial,
      timeframe,
      completion: completionDate ? true : false, // Set to true if completion date is provided
    });

    await newProject.save();

    res.status(201).json({
      status: 'success',
      data: newProject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error, unable to create project.',
    });
  }
};
