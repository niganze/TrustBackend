import mongoose from 'mongoose';

const subsidiarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add the subsidiary name'],
  },
  telephone: {
    type: String,
    required: [true, 'Please add a telephone number'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email address'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email address',
    ],
  },
  logoImage: {
    type: String, // store the image path or URL
    required: [true, 'Please upload a logo image'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Subsidiary = mongoose.model('Subsidiary', subsidiarySchema);

export default Subsidiary;
