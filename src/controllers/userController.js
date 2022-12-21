const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const aws = require("../aws/aws");
const ErrorHandler = require("../errorHandler/errorHandlingClass");

exports.createUser = async function (req, res, next) {
  const { files } = req;
  if (!(files && files.length)) {
    return next(new ErrorHandler(400, "Please upload profile picture"));
  }
  req.body.profileImage = await aws.uploadFile(files[0]);

  const newUser = await User.create(req.body);
  res.status(201).send({
    status: true,
    message: "User created successfully",
    data: newUser,
  });
};

exports.loginUser = async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler(400, "Please provide email and password"));
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ErrorHandler(401, "Incorrect email or password"));
  }
  const token = jwt.sign({ userId: user._id }, "group-16-password", {
    expiresIn: "10h",
  });
  return res.status(200).send({
    status: true,
    message: "User login successfull",
    data: { userId: user._id, token },
  });
};

exports.getUserProfile = async function (req, res, next) {
  const user = await User.findById(req.params.userId);

  res.status(200).send({
    status: true,
    message: "Fetch user details is successful",
    data: user,
  });
};

exports.updateProfile = async function (req, res, next) {
  const { userId } = req.params;
  const { fname, lname, address, phone, email, profileImage } = req.body;
  let { password } = req.body;
  if (password) {
    if (password.length >= 8 && password.length <= 15) {
      password = await bcrypt.hash(password, 12);
    } else {
      return next(
        new ErrorHandler(400, "Password should be between 8-15 characters")
      );
    }
  }

  const user = await User.findOne({ $or: [{ email, phone }] });
  if (user) {
    return next(new ErrorHandler(400, "This Email or phone already exist"));
  }
  if (Object.keys(req.body).length !== 0) {
    const Updatedata = await User.updateOne(
      { _id: userId },
      { $set: { fname, lname, address, phone, email, password, profileImage } },
      { new: true }
    );
    res.status(200).send({
      status: true,
      message: "User profile Updated",
      data: Updatedata,
    });
  }
};
