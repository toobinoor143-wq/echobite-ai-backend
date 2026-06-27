const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["percentage", "flat"],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
    required: false, // agar specific food pe discount ho
  },
  category: {
    type: String, // optional: burger, pizza etc
  },
  expiresAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Discount", discountSchema);