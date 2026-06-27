const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  fullName: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  city: String,
  area: String,
  street: String,
  postalCode: String,

  isDefault: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Address", addressSchema);