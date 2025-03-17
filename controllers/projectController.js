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


