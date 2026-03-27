const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const config = require("../config/config");

const hasCloudinaryCredentials = () => {
  const cloudName = String(config.cloudinary.cloudName || "").trim();
  const apiKey = String(config.cloudinary.apiKey || "").trim();
  const apiSecret = String(config.cloudinary.apiSecret || "").trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }

  const placeholders = ["your_cloud_name", "your_api_key", "your_api_secret"];
  return ![cloudName, apiKey, apiSecret].some((value) =>
    placeholders.includes(value.toLowerCase()),
  );
};

const useCloudinaryStorage = hasCloudinaryCredentials();

if (useCloudinaryStorage) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
} else {
  console.warn(
    "Cloudinary credentials are missing/placeholder. Falling back to local file uploads.",
  );
}

const makeStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `rental-market/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });

const localFolderMap = {
  ads: "ad_images",
  categories: "category_icons",
  features: "feature_icons",
  "featured-categories": "featured_category_images",
};

const makeLocalStorage = (folder) => {
  const localFolder = localFolderMap[folder] || folder;

  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        localFolder,
      );
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const originalName = path.parse(file.originalname).name;
      const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
      const safeName =
        originalName.replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "upload";
      cb(
        null,
        `${safeName}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`,
      );
    },
  });
};

const makeUploader = (folder) => {
  const storage = useCloudinaryStorage
    ? makeStorage(folder)
    : makeLocalStorage(folder);
  return multer({ storage });
};

const uploadAdImage = makeUploader("ads");
const uploadCategoryIcon = makeUploader("categories");
const uploadFeatureIcon = makeUploader("features");
const uploadFeaturedCategoryImage = makeUploader("featured-categories");

module.exports = {
  uploadAdImage,
  uploadCategoryIcon,
  uploadFeatureIcon,
  uploadFeaturedCategoryImage,
};
