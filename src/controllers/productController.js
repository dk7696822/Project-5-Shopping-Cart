const Product = require("../models/productModel");
const aws = require("../aws/aws");
const ErrorHandler = require("../errorHandler/errorHandlingClass");
const QueryFilter = require("../utils/QueryFilter");
const { isValidObjectId } = require("mongoose");

exports.createProduct = async (req, res, next) => {
  const { files } = req;
  const { availableSizes } = req.body;
  if (!(files && files.length)) {
    return next(new ErrorHandler(400, "Please upload image of the product"));
  }
  req.body.productImage = await aws.uploadFile(files[0]);
  if (availableSizes) {
    const sizesAvailable = availableSizes.split(",").map((el) => el.trim());
    req.body.availableSizes = sizesAvailable;
  }
  const newProduct = await Product.create(req.body);
  return res
    .status(201)
    .send({ status: true, message: "Success", data: newProduct });
};

exports.getProducts = async (req, res, next) => {
  if (req.params.productId) {
    if (!isValidObjectId(req.params.productId)) {
      return next(new ErrorHandler(400, "Invalid ID"));
    }
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(new ErrorHandler(404, "No products exists with this ID"));
    }
    return res.status(200).send({ status: true, data: product });
  }

  if (Object.keys(req.query).length === 0) {
    const products = await Product.find();
    return res.status(200).send({ status: true, data: products });
  }
  const queryProducts = new QueryFilter(Product.find(), req.query)
    .filter()
    .sort();
  const products = await queryProducts.query;
  if (products.length === 0) {
    return next(new ErrorHandler(404, "No products matched this filter"));
  }
  res.status(200).send({ status: true, data: products });
};
