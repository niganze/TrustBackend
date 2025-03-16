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
  client: {
    type: String,
    required: [true, 'Please add a client name'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  tags: [String],
  images: [String], // Store an array of image URLs
  link: {
    type: String,
    default: '',
  },
  featured: {
    type: String,
    default: 'No',
  },
  completionDate: {
    type: Date,
    default: Date.now,
  },
  size: {
    type: String,
    required: [true, 'Please add a size'],
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget'],
  },
  duration: {
    type: String,
    required: [true, 'Please add a duration'],
  },
  teamSize: {
    type: Number,
    required: [true, 'Please add a team size'],
  },
  testimonial: {
    type: String,
    default: '',
  },
  timeframe: {
    type: String,
    required: [true, 'Please add a timeframe'],
  },
  completion: {
    type: String,
    default: 'Not Completed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
