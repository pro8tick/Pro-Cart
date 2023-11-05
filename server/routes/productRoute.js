const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, adminOnly, createProduct).get(getProducts);
router
  .route("/:id")
  .get(getProduct)
  .delete(protect, adminOnly, deleteProduct)
  .patch(protect, adminOnly, updateProduct);

module.exports = router;
