const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel");

const createProduct = asyncHandler(async (req, res) => {
  //Create product
  const doc = await Product.create(req.body);

  res.status(201).json(doc);
});

const getProducts = asyncHandler(async (req, res) => {
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  if (req.query.category) {
    query = query.find({ category: { $in: req.query.category.split(",") } });
    totalProductsQuery = totalProductsQuery.find({
      category: { $in: req.query.category.split(",") },
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: { $in: req.query.brand.split(",") } });
    totalProductsQuery = totalProductsQuery.find({
      brand: { $in: req.query.brand.split(",") },
    });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }
  const docs = await query.exec();
  res.set("X-Total-Count", totalDocs);
  res.status(200).json(docs);
});

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).sort("-createdAt");
  if (!product) {
    res.status(404);
    throw new Error("Product not Found");
  }
  res.status(200).json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not Found");
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
});

//Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const updatedProd = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedProd) {
    res.status(404);
    throw new Error("Product not Found");
  }

  res.status(201).json(updatedProd);
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
