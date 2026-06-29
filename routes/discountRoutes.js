const express = require("express");
const router = express.Router();

const Discount = require("../models/discount");
const Food = require("../models/Food");


// CREATE DISCOUNT
router.post("/create", async (req, res) => {
  try {
    const discount = await Discount.create(req.body);
    res.json({ success: true, discount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// GET ALL DISCOUNTS
router.get("/all", async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.json({ success: true, discounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// APPLY DISCOUNT ON FOOD
router.post("/apply", async (req, res) => {
  try {
    const { code, foodId } = req.body;

    const discount = await Discount.findOne({ code, isActive: true });

    if (!discount) {
      return res.json({ success: false, message: "Invalid discount code" });
    }

    const food = await Food.findById(foodId);

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    let finalPrice = food.price;

    if (discount.type === "percentage") {
      finalPrice = food.price - (food.price * discount.value) / 100;
    } else {
      finalPrice = food.price - discount.value;
    }

    res.json({
      success: true,
      originalPrice: food.price,
      finalPrice,
      discountApplied: discount.code,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;