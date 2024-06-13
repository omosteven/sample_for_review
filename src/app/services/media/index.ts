import multer from "multer";

import cloudinary from "../../../config/cloudinary";

const storage = multer.memoryStorage();

export const uploadToCloudinary = async (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error: any, result: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(file.buffer);
  });
};

export const uploadMulterFile = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limiting file size to 10MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("video") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Invalid file type")); // Reject the file with an error
    }
  },
}).single("file");
