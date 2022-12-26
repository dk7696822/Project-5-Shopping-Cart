
// prettier-ignore
const express = require("express");
const { createUser, loginUser, getUserProfile, updateProfile } = require("../controllers/userController");
const { authentication, authorization } = require("../controllers/authController");
const { createProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController");
const { addToCart, updateCart, getCartSummary, deleteCart } = require("../controllers/cartController");
const { checkOut, updateOrder } = require('../controllers/orderController')

const router = express.Router();
// eslint-disable-next-line arrow-body-style
const use = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
//USER API
router.post("/register", use(createUser));
router.post("/login", use(loginUser));
router.get("/user/:userId/profile", authentication, authorization, use(getUserProfile));
router.put("/user/:userId/profile", authentication, authorization, use(updateProfile));

//PRODUCT API
router.post("/product", use(createProduct));
router.get("/product/:productId?", use(getProducts));
router.put("/product/:productId", use(updateProduct));
router.delete("/product/:productId", use(deleteProduct));

//CART API
router.post("/users/:userId/cart", authentication, authorization, use(addToCart));
router.put("/users/:userId/cart", authentication, authorization, use(updateCart));
router.get("/users/:userId/cart", authentication, authorization, use(getCartSummary));
router.delete("/users/:userId/cart", authentication, authorization, use(deleteCart));

//ORDER API
router.post('/users/:userId/orders', authentication, authorization, use(checkOut))
router.put('/users/:userId/orders', authentication, authorization, use(updateOrder))
module.exports = router;
