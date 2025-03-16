import Subsidiary from '../models/subsidiaryModel.js';

// Create Subsidiary
export const createSubsidiary = async (req, res) => {
  try {
    const { name, telephone, email } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Logo image is required' });
    }

    const logoImage = req.file.path; // Cloudinary returns a URL in path

    const subsidiary = await Subsidiary.create({
      name,
      telephone,
      email,
      logoImage,
    });

    res.status(201).json({
      status: 'success',
      data: subsidiary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Subsidiaries
export const getAllSubsidiaries = async (req, res) => {
  try {
    const subsidiaries = await Subsidiary.find();
    res.status(200).json({
      status: 'success',
      results: subsidiaries.length,
      data: subsidiaries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Subsidiary
export const getSubsidiaryById = async (req, res) => {
  try {
    const subsidiary = await Subsidiary.findById(req.params.id);
    if (!subsidiary) {
      return res.status(404).json({ message: 'Subsidiary not found' });
    }

    res.status(200).json({
      status: 'success',
      data: subsidiary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Subsidiary
export const updateSubsidiary = async (req, res) => {
  try {
    const { name, telephone, email } = req.body;
    const subsidiary = await Subsidiary.findById(req.params.id);

    if (!subsidiary) {
      return res.status(404).json({ message: 'Subsidiary not found' });
    }

    // Update logo if a new file is uploaded
    if (req.file) {
      subsidiary.logoImage = req.file.path;
    }

    subsidiary.name = name || subsidiary.name;
    subsidiary.telephone = telephone || subsidiary.telephone;
    subsidiary.email = email || subsidiary.email;

    await subsidiary.save();

    res.status(200).json({
      status: 'success',
      data: subsidiary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Subsidiary
export const deleteSubsidiary = async (req, res) => {
  try {
    const subsidiary = await Subsidiary.findByIdAndDelete(req.params.id);

    if (!subsidiary) {
      return res.status(404).json({ message: 'Subsidiary not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Subsidiary deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
