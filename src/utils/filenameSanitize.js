const path = require('path');

const sanitizeFilename = (filename) => path.basename(filename);

module.exports = {
  sanitizeFilename,
};
