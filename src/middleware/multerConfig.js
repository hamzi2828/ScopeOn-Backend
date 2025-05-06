const multer = require('multer');
const path = require('path');
const { getUploadPath } = require('../utils/mediaHelper');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // You can use a subfolder for listings if desired
    const uploadPath = getUploadPath('listing-photos');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only jpg, jpeg, png
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG images are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 20 }, // 5MB, max 20 files
});

module.exports = upload;
