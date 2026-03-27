const fs = require('fs');
const path = require('path');

// Utility function to cleanup files
const cleanupFiles = (filePaths) => {
  filePaths.forEach((filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${filePath}:`, err);
      }
    });
  });
};

module.exports = {
  cleanupFiles,
};
