const express = require("express");
const router = express.Router();

const {
  updateUser,
  updatePhoto,
  blockUser,
  unblockUser,
  getUser,
} = require("../controllers/userController");

const { adminOnly } = require("../middleware/authMiddleware");

router.get("/getUser", getUser);
router.patch("/updateUser", updateUser);
router.patch("/updatePhoto", updatePhoto);
router.patch("/block-user/:id", adminOnly, blockUser);
router.patch("/unblock-user/:id", adminOnly, unblockUser);

module.exports = router;
