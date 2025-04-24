const path = require('path');
const fs = require('fs');

/**
 * Ensures the uploads directory exists and returns the upload path.
 * @param {string} [subfolder] - Optional subfolder for organization (e.g., 'listing-photos')
 * @returns {string} The absolute path to the upload directory
 */
function getUploadPath(subfolder = '') {
  const baseDir = path.join(__dirname, '..', '..', 'uploads');
  const uploadDir = subfolder ? path.join(baseDir, subfolder) : baseDir;
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}

module.exports = {
  getUploadPath,
};
