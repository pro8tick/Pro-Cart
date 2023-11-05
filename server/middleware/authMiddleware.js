const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const protect = asyncHandler(async (req, res, next) => {
  token = req.cookies.token || null;

  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, please login");
  }

  //verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(verified.id).select("-password");

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  req.user = user;
  next();
});

//Admin only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Only Admin can add product");
  }
};

module.exports = {
  protect,
  adminOnly,
};
