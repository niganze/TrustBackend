import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  image: {
    type: String,
    required: [true, 'Please add a main image'], // main image URL
  },
  timeline: {
    type: String,
    required: [true, 'Please add a timeline'],
  },
  budget: {
    type: String,
    required: [true, 'Please add a budget'],
  },
  owner: {
    type: String,
    required: [true, 'Please add an owner'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  gallery: {
    type: [String], // array of image URLs
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
