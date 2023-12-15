const express = require("express");
const {
  fetchCategories,
  createCategory,
} = require("../controllers/categoryController");

const router = express.Router();
//  /categories is already added in base path
router.get("/", fetchCategories).post("/", createCategory);

module.exports = router;
