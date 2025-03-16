import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  position: {
    type: String,
    required: [true, 'Please add a position'],
  },
  company: {
    type: String,
    required: [true, 'Please add a company'],
  },
  content: {
    type: String,
    required: [true, 'Please add testimonial content'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating'],
  },
  image: {
    type: String,
    default: '',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;