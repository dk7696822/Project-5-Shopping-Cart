const ErrorHandler = require("./errorHandlingClass");

const ValidationError = (err) => {
  const message = `Invalid input data. ${err.message}`;
  return new ErrorHandler(400, message);
};

const DuplicateError = (err) => {
  const message = `Duplicate value provided at ${Object.keys(
    err.keyValue
  )}: ${Object.values(err.keyValue)}`;
  return new ErrorHandler(400, message);
};

const CastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ErrorHandler(400, message);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = "false";
  if (err.name === "CastError") err = CastError(err);
  if (err.code === 11000) err = DuplicateError(err);
  if (err.name === "ValidationError") err = ValidationError(err);
  return res
    .status(err.statusCode)
    .send({ status: err.status, message: err.message });
};
