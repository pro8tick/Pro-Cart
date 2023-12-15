const asyncHandler = require("express-async-handler");
const passport = require("passport");
const protect = (req, res, next) => {
  return passport.authenticate("jwt");
};

//Admin only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Only Admin can add product");
  }
};

const sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
}

module.exports = {
  protect,
  adminOnly,
  sanitizeUser,
  cookieExtractor,
};
