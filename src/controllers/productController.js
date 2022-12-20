const Product = require("../models/productModel");
const aws = require("../aws/aws");
const ErrorHandler = require("../errorHandler/errorHandlingClass");
const QueryFilter = require("../utils/QueryFilter");

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
  const products = new QueryFilter(Product.find(), req.query).filter();
  if (products.length === 0) {
    return next(new ErrorHandler(404, "No products matched this filter"));
  }
  res.status(200).send({ status: true, data: products });
};
