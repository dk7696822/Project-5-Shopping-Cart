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
module.exports = router;
