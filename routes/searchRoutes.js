const express = require("express");
const router = express.Router();
const Food = require("../models/Food");


// 1. Search Food by Keyword
router.get("/", async (req, res) => {
  try {
    const { keyword } = req.query;

    const foods = await Food.find({
      name: { $regex: keyword, $options: "i" }
    });

    res.status(200).json({
      success: true,
      foods
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// 2. Search by Category
router.get("/category/:category", async (req, res) => {
  try {
    const foods = await Food.find({
      category: req.params.category
    });

    res.status(200).json({
      success: true,
      foods
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// 3. Search Filter
router.get("/filter", async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query["sizes.price"] = {};

      if (minPrice) {
        query["sizes.price"].$gte = Number(minPrice);
      }

      if (maxPrice) {
        query["sizes.price"].$lte = Number(maxPrice);
      }
    }

    const foods = await Food.find(query);

    res.status(200).json({
      success: true,
      foods
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;