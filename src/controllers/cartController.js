/* eslint-disable operator-assignment */
/* eslint-disable no-unused-expressions */
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../errorHandler/errorHandlingClass");

exports.addToCart = async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.body.productId,
    isDeleted: false,
  });
  if (!product) {
    return next(
      new ErrorHandler(404, "Either the product does not exist or is deleted")
    );
  }
  const cart = await Cart.findOne({
    userId: req.params.userId,
  });
  if (!cart) {
    const items = [];
    items.push({ productId: req.body.productId, quantity: 1 });
    req.body.items = items;
    req.body.userId = req.params.userId;
    req.body.totalPrice = product.price;
    req.body.totalItems = 1;
    const newCart = await Cart.create(req.body);
    return res.status(201).send({ status: true, data: newCart });
  }
  const carts = JSON.parse(JSON.stringify(cart));
  // eslint-disable-next-line array-callback-return
  const result = carts.items.map((el) => {
    if (el.productId === req.body.productId) {
      el.quantity = el.quantity + 1;
      console.log(el.quantity);
      return el.quantity;
    }
  });
  const hasNumber = /\d/;
  if (hasNumber.test(result)) {
    carts.totalPrice += product.price;
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $set: carts,
      },
      { new: true }
    ).populate("items");
    return res.status(200).send({ status: true, data: updatedCart });
  }

  carts.items.push({ productId: req.body.productId, quantity: 1 });
  carts.totalPrice += product.price;
  carts.totalItems += 1;
  const updatedCart = await Cart.findOneAndUpdate(
    { userId: req.params.userId },
    {
      $set: carts,
    },
    { new: true }
  ).populate("items");
  return res.status(200).send({ status: true, data: updatedCart });
};
