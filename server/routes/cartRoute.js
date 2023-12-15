const express = require("express");
const {
  addToCart,
  fetchCartByUser,
  deleteFromCart,
  updateCart,
} = require("../controllers/cartController");

const router = express.Router();
//  /products is already added in base path

router.route("/").post(addToCart).get(fetchCartByUser);
router.route("/:id").delete(deleteFromCart).patch(updateCart);

module.exports = router;
