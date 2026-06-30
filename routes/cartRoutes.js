const express = require("express");
const router = express.Router();

const Cart = require("../models/cart");

function recalculateTotal(cart) {
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

// GET CART BY USER
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    res.json({
      success: true,
      cart: cart || { items: [], totalPrice: 0 }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

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
      quantity,
      image
    } = req.body;

    if (!userId || !productId || !name || price == null) {
      return res.status(400).json({
        success: false,
        message: "userId, productId, name, and price are required"
      });
    }

    const itemQuantity = Number(quantity) || 1;
    const itemSize = selectedSize || "Regular";

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        userName,
        items: [{
          productId,
          name,
          selectedSize: itemSize,
          price: Number(price),
          quantity: itemQuantity,
          image: image || ""
        }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item =>
          item.productId.toString() === String(productId) &&
          item.selectedSize === itemSize
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += itemQuantity;
        if (image) {
          cart.items[itemIndex].image = image;
        }
      } else {
        cart.items.push({
          productId,
          name,
          selectedSize: itemSize,
          price: Number(price),
          quantity: itemQuantity,
          image: image || ""
        });
      }
    }

    recalculateTotal(cart);
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

// UPDATE CART ITEM QUANTITY (0 removes item)
router.put("/update", async (req, res) => {
  try {
    const { userId, productId, selectedSize, quantity } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId and productId are required"
      });
    }

    const itemSize = selectedSize || "Regular";
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const itemIndex = cart.items.findIndex(
      item =>
        item.productId.toString() === String(productId) &&
        item.selectedSize === itemSize
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    if (Number(quantity) <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    recalculateTotal(cart);
    await cart.save();

    res.json({
      success: true,
      message: "Cart updated",
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