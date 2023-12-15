const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  getLoginStatus,
} = require("../controllers/userController");
const passport = require("passport");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", passport.authenticate("local"), loginUser);
router.get("/logout", logout);
router.get("/getLoginStatus", passport.authenticate("jwt"), getLoginStatus);

module.exports = router;
