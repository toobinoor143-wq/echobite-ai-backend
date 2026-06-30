const Cart = require("../models/cart");
const Order = require("../models/order");

exports.checkout = async (req, res) => {
  try {
    const { userId, addressId, paymentMethod } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const order = await Order.create({
      userId,
      items: cart.items,
      addressId,
      paymentMethod,
      totalAmount,
      status: "Pending"
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Checkout successful",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};