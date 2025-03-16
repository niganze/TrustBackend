import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied'],
    default: 'unread',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;