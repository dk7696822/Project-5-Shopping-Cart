const express = require("express");
const { createUser, loginUser } = require("../controllers/userController");

const router = express.Router();
const use = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
// USER APIs
router.post("/register", use(createUser));
router.post("/login", loginUser);
// router.get(
//   "/user/:userId/profile",
//   middleware.authentication,
//   middleware.authorization,
//   userController.getUserById
// );
// router.put(
//   "/user/:userId/profile",
//   middleware.authentication,
//   middleware.authorization,
//   userController.updateUser
// );
module.exports = router;
