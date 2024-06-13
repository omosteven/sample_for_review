import { Request, Response, NextFunction } from "express";

import multer from "multer";

import { uploadMulterFile, uploadToCloudinary } from "../services/media";

const upload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body.user;
    // --- Perform the file upload using multer ---
    uploadMulterFile(req, res, async (err: any) => {
      if (err) {
        // --- Multer error handling ---
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res
              .status(400)
              .json({ error: "File size exceeds 10MB limit", code: 400 });
          } else {
            return res.status(400).json({ error: err.message, code: 400 });
          }
        } else {
          return res.status(400).json({ error: "Invalid file", code: 400 });
        }
      } else if (!req.file) {
        // --- if multer didn't receive a file ---
        return res.status(400).json({ error: "No file uploaded", code: 400 });
      } else {
        // --- if multer successfully uploaded the file, continue processing ---
        const file = req.file;

        // --- Upload file to Cloudinary ---
        try {
          const cloudinaryResult: any = await uploadToCloudinary(file);

          // --- Attach Cloudinary response to req.body.fileInfo ---
          req.body.uploadedFileInfo = {
            fileName: cloudinaryResult.original_filename,
            fileType: cloudinaryResult.resource_type.toUpperCase(),
            fileSize: cloudinaryResult.bytes,
            fileUrl: cloudinaryResult.secure_url,
          };

          req.body.user = user;

          next();
        } catch (cloudinaryError) {
          return res
            .status(500)
            .json({ error: "Error uploading file to cloud", code: 500 });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ error: "Error uploading file", code: 500 });
  }
};

export default upload;
