import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from '../config/cloudinary.js';

// Debug logger to help diagnose issues
const logUploadInfo = (req, file, label) => {
  console.log(`----- ${label} -----`);
  console.log('File:', file);
  console.log('Fieldname:', file.fieldname);
  console.log('Mimetype:', file.mimetype);
  console.log('Original name:', file.originalname);
  console.log('------------------');
};

// Single file uploader for Cloudinary with improved debugging
const uploadSingleCloud = (fieldName = 'image', folder = "general") => {
  console.log(`Setting up single upload for field: ${fieldName}, folder: ${folder}`);
  
  const singleStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      logUploadInfo(req, file, 'Upload Attempt');
      
      return {
        folder: folder,
        resource_type: "auto",
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
        transformation: file.mimetype.startsWith('image/') ? [
          { width: 1000, crop: "limit" }
        ] : undefined
      };
    }
  });

  return multer({ 
    storage: singleStorage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
    }
  }).single(fieldName);
};

// Multiple file uploader for Cloudinary - simplified version
const uploadMultipleCloud = (fieldConfig = {}) => {
  console.log('Setting up multiple upload with config:', fieldConfig);
  
  // Default field configuration
  const fields = fieldConfig.fields || ['images'];
  const maxCount = fieldConfig.maxCount || 5;
  const folder = fieldConfig.folder || 'general';
  
  const multiStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      logUploadInfo(req, file, 'Multiple Upload Attempt');
      
      return {
        folder: folder,
        resource_type: "auto",
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`
      };
    }
  });
  
  // Create field configuration array for multer
  const fieldArray = Array.isArray(fields) 
    ? fields.map(field => ({ name: field, maxCount }))
    : [{ name: fields, maxCount }];
  
  return multer({ 
    storage: multiStorage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
  }).fields(fieldArray);
};

// For handling any field type - useful for debugging
const uploadAny = (folder = "general") => {
  console.log('Setting up any-field upload to folder:', folder);
  
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      logUploadInfo(req, file, 'Any Upload Attempt');
      
      return {
        folder: folder,
        resource_type: "auto",
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`
      };
    }
  });

  return multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
  }).any();
};

// Export the named functions
export { uploadSingleCloud, uploadMultipleCloud, uploadAny };
export default { uploadSingleCloud, uploadMultipleCloud, uploadAny };
