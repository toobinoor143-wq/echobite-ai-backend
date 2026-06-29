const express = require("express");
const router = express.Router();
const Address = require("../models/Address");


// ➤ Add Address
router.post("/add", async (req, res) => {
  try {
    const address = new Address(req.body);
    await address.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ➤ Get User Addresses
router.get("/:userId", async (req, res) => {
  try {
    const addresses = await Address.find({
      userId: req.params.userId
    });

    res.status(200).json({
      success: true,
      addresses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ➤ Update Address
router.put("/:id", async (req, res) => {
  try {
    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Address updated",
      updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ➤ Delete Address
router.delete("/:id", async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Address deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;