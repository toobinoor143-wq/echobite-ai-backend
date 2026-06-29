const express = require("express");
const router = express.Router();
const Payment = require("../models/payment");

//create payment api
router.post("/create", async (req, res) => {
  try {
    const { userId, userName, orderId, amount, method } = req.body;

    const payment = new Payment({
      userId,
      userName,
      orderId,
      amount,
      method
    });

    await payment.save();

    res.json({
      success: true,
      message: "Payment created successfully",
      payment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Verify payment API
router.get("/verify/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    payment.status = "paid";
    await payment.save();

    res.json({
      success: true,
      message: "Payment verified successfully",
      payment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

//payment history API
router.get("/history/:userId", async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });

    res.json({
      success: true,
      count: payments.length,
      payments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;