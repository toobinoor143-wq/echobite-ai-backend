const express = require("express");
const router = express.Router();
const Review = require("../models/review");

//POST /api/review/add

router.post("/add", async (req, res) => {
  try {
    const { userId, userName, productId, rating, comment } = req.body;

    const review = new Review({
      userId,
      userName,
      productId,
      rating,
      comment,
    });

    await review.save();

    res.json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//
//GET /api/review/product/:productId

router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;