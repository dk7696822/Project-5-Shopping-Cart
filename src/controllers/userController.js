const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
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

exports.updateUser = async function (req, res) {
  const { userId } = req.params;
  if (!isValidObjectId(userId))
    return res.status(400).send({ status: false, message: "Invalid userId" });
  const Updatedata = await User.findOneAndUpdate(
    { _id: userId },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  res.status(200).send({
    status: true,
    message: "User profile Updated",
    data: Updatedata,
  });
};

//================================================[MODULE EXPORTS]=======================================================================

// module.exports.createUser = createUser;
// module.exports.loginUser = loginUser;
// module.exports.getUserById = getUserById;
// module.exports.updateUser = updateUse;
