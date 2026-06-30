exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      filename: req.file.filename,
      imageUrl: `${baseUrl}/images/${req.file.filename}`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};