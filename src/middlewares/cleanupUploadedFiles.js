// With Cloudinary, files are uploaded to the cloud directly.
// Local disk cleanup is no longer needed, but this middleware
// is kept for compatibility with existing route error handlers.
const cleanupUploadedFiles = (err, req, res, next) => {
  next(err);
};

module.exports = { cleanupUploadedFiles };
