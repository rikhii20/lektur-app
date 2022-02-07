const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

module.exports = {
  uploadCloud: (fieldName, type) => {
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: (req, file) => {
        return {
          folder: fieldName,
          resource_type: "raw",
          public_id: `${Date.now()}-${file.originalname}`,
        };
      },
    });

    const imageFilter = (req, file, cb) => {
      if (!file.mimetype.includes("image")) {
        return cb(new Error("Please select image files only"), false);
      }
      cb(null, true);
    };

    const videoFilter = (req, file, cb) => {
      if (!file.mimetype.includes("video")) {
        return cb(new Error("Please select video files only"), false);
      }
      cb(null, true);
    };

    const pdfFilter = (req, file, cb) => {
      if (!file.mimetype.includes("application")) {
        return cb(new Error("Please select pdf files only"), false);
      }
      cb(null, true);
    };

    const upload = multer({
      storage,
      fileFilter:
        type == "image"
          ? imageFilter
          : type == "video"
          ? videoFilter
          : pdfFilter,
    }).single(fieldName);

    return (req, res, next) => {
      upload(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            status: "Bad Request",
            message: err.message,
            result: {},
          });
        }
        next();
      });
    };
  },
};
