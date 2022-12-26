const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const ErrorHandler = require("../errorHandler/errorHandlingClass");

exports.checkOut = async (req, res, next) => {
  const data = req.body;
  const cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart) {
    return next(new ErrorHandler(404, "No cart exist for this user"));
  }
  if (cart.items.length === 0) {
    return next(
      new ErrorHandler(404, "Please add products in your cart to checkout")
    );
  }
  const carts = JSON.parse(JSON.stringify(cart));

  data.userId = req.params.userId;
  data.items = carts.items;
  data.totalPrice = carts.totalPrice;
  data.totalItems = carts.totalItems;
  if (!data.cancellable) {
    data.cancellable = true;
  }
  if (!data.status) {
    data.status = "pending";
  }
  const order = await Order.create(data);

  carts.items.length = 0;
  carts.totalPrice = 0;
  carts.totalItems = 0;
  await Cart.findOneAndUpdate({ userId: req.params.userId }, { $set: carts });
  return res.status(201).send({ status: true, data: order });
};

exports.updateOrder = async (req, res, next) => {
  if (!req.body.status) {
    return next(
      new ErrorHandler(400, "Status not provided, not able to update order")
    );
  }
  const { userId } = req.params;
  const { status } = req.body;
  const order = await Order.findOneAndUpdate(
    { userId },
    { $set: { status } },
    { new: true, runValidators: true }
  );
  return res.status(200).send({ status: true, data: order });
};
