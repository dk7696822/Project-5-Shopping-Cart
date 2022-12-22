const express = require("express");
const {
  createUser,
  loginUser,
  getUserProfile,
  updateProfile,
} = require("../controllers/userController");
const {
  authentication,
  authorization,
} = require("../controllers/authController");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { addToCart, updateCart } = require("../controllers/cartController");

const router = express.Router();
// eslint-disable-next-line arrow-body-style
const use = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
// USER APIs
router.post("/register", use(createUser));
router.post("/login", use(loginUser));
router.get(
  "/user/:userId/profile",
  authentication,
  authorization,
  use(getUserProfile)
);
router.put(
  "/user/:userId/profile",
  authentication,
  authorization,
  use(updateProfile)
);
router.post("/product", use(createProduct));
router.get("/product/:productId?", use(getProducts));
router.put("/product/:productId", use(updateProduct));
router.delete("/product/:productId", use(deleteProduct));
router.post(
  "/users/:userId/cart",
  authentication,
  authorization,
  use(addToCart)
);
router.put(
  "/users/:userId/cart",
  authentication,
  authorization,
  use(updateCart)
);
module.exports = router;
