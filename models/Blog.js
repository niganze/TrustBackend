import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  summary: {
    type: String,
    required: [true, 'Please add a summary'],
    maxlength: [500, 'Summary cannot be more than 500 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  slug: {
    type: String,
    unique: true,
    default: function() {
      return this.title
        ? this.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-6)
        : 'blog-' + Date.now().toString();
    }
  },
  image: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    required: [true, 'Please add content'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  tags: [String],
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Set publishedAt date when publishing
blogSchema.pre('save', function (next) {
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  
  this.updatedAt = Date.now();
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;