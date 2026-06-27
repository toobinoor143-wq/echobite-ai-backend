const express = require("express");
const router = express.Router();

const Cart = require("../models/cart");

// ADD TO CART
router.post("/add", async (req, res) => {
  try {
    const {
      userId,
      userName,
      productId,
      name,
      selectedSize,
      price,
      quantity
    } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        userName,
        items: [{
          productId,
          name,
          selectedSize,
          price,
          quantity
        }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item =>
          item.productId.toString() === productId &&
          item.selectedSize === selectedSize
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({
          productId,
          name,
          selectedSize,
          price,
          quantity
        });
      }
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.json({
      success: true,
      message: "Item added to cart",
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;