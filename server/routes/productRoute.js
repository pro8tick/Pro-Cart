const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const { adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(createProduct).get(getProducts);
router
  .route("/:id")
  .get(getProduct)
  .delete(adminOnly, deleteProduct)
  .patch(adminOnly, updateProduct);

module.exports = router;
