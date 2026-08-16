import multer from 'multer';
import path from 'path';

// Store files in memory as Buffers to allow direct streaming to Cloudinary
const storage = multer.memoryStorage();

// File filter to validate image formats
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp|gif/;
  
  // Verify extension name
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  // Verify mimetype
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  
  // Reject file if format is invalid
  cb(new Error('Invalid file type. Only JPEG, JPG, PNG, WEBP, and GIF images are allowed!'), false);
};

// Initialize multer upload configuration
export const uploadSingleImage = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximum file size limit
  },
  fileFilter: fileFilter,
}).single('image');

export default uploadSingleImage;
