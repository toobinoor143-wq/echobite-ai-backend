const cloudinary = require("../config/cloudinary");

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "echobite/foods",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(buffer);
  });
}

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      filename: result.secure_url,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Image upload failed",
    });
  }
};
