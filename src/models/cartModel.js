const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "user",
      required: [true, "Please provide the user ID"],
      unique: true,
    },
    items: [
      {
        productId: {
          type: ObjectId,
          ref: "product",
          required: [true, "Please provide product ID"],
        },
        quantity: {
          type: Number,
          required: [true, "Please mention the quantity"],
          min: [1, "Minimum quantity should be 1"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, "Please mention the total price"],
    },
    totalItems: {
      type: Number,
      required: [true, "Please mention total items"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
