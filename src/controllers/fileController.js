import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      type: result.resource_type,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};