const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  getLoginStatus,
  updateUser,
  updatePhoto,
  blockUser,
  unblockUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getUser", protect, getUser);
router.get("/getLoginStatus", getLoginStatus);
router.patch("/updateUser", protect, updateUser);
router.patch("/updatePhoto", protect, updatePhoto);
router.patch("/block-user/:id", protect, adminOnly, blockUser);
router.patch("/unblock-user/:id", protect, adminOnly, unblockUser);

module.exports = router;
