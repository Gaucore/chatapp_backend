import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (
  fileBuffer,
  mimetype,
  folder = "chat-app"
) => {
  return new Promise((resolve, reject) => {
    let resourceType = "raw";

    // Image
    if (mimetype.startsWith("image/")) {
      resourceType = "image";
    }

    // Video + Audio
    else if (
      mimetype.startsWith("video/") ||
      mimetype.startsWith("audio/")
    ) {
      resourceType = "video";
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier
      .createReadStream(fileBuffer)
      .pipe(uploadStream);
  });
};