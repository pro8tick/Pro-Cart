const Brand = require("../model/brandModel");

exports.fetchBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).exec();
    res.status(200).json(brands);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createBrand = async (req, res) => {
  try {
    const doc = await Brand.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
