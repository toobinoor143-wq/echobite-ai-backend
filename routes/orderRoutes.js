const express = require("express");
const router = express.Router();
const Order = require("../models/order");


// PLACE ORDER
router.post("/place", async (req, res) => {
  try {
    const { userId, userName,items } = req.body;

    const totalPrice = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = new Order({
      userId,
      userName,
      items,
      totalPrice,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// GET ALL ORDERS
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// GET ORDER SUMMARY
router.get("/summary/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const summary = {
      orderId: order._id,
      customerName: order.userName,
      status: order.status,
      totalItems: order.items.reduce(
        (total, item) => total + item.quantity,
        0
      ),
      items: order.items.map((item) => ({
        foodId: item.foodId,
        foodName: item.foodName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      })),
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
    };

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE ORDER STATUS
router.put("/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// DELETE ORDER
router.delete("/:orderId", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;