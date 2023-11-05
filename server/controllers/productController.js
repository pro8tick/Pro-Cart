const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel");

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    category,
    brand,
    quantity,
    price,
    description,
    image,
    regularPrice,
    color,
  } = req.body;

  //Create product
  const product = await Product.create({
    name,
    sku,
    category,
    brand,
    quantity,
    price,
    description,
    image,
    regularPrice,
    color,
  });

  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort("-createdAt");
  res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).sort("-createdAt");
  if (!product) {
    res.status(404);
    throw new Error("Product not Found");
  }
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
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
  const {
    name,
    category,
    brand,
    quantity,
    price,
    description,
    image,
    regularPrice,
    color,
  } = req.body;

  const updatedProd = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      category,
      brand,
      quantity,
      price,
      description,
      image,
      regularPrice,
      color,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProd) {
    res.status(404);
    throw new Error("Product not Found");
  }

  res.status(201).json({
    status: "success",
    data: {
      updatedProd,
    },
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
