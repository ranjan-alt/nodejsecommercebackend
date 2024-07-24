const express = require("express");
const router = express.Router();

const Product = require("../models/product");
const Category = require("../models/category");
const mongoose = require("mongoose");

router.get(`/`, async (req, res) => {
  //we got since find method is returning a promise and i am sending response maybe this productList is not ready yet
  // to get off this error we have to use async await
  // if we want to display only few products then we use select method
  // const productList = await Product.find().select("name image -_id");
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(filter).populate("category");
  // if any issue happens while getting productList
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.status(200).json({ productList });
});

router.get("/:id", async (req, res) => {
  let product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    res.status(500).json({ success: fail });
  }
  res.send(product);
});

router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).json("invalid category");
  }
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();
  if (!product) {
    return res.send(500).send("The product cannot be created");
  }
  res.send(product);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("invalid product id");
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    res.status(400).send("invalid category");
  }

  let product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  ).populate("category");

  if (!product) {
    res.status(400).json({ message: "Porduct not found" });
  }

  res.send(product);
});

router.delete("/:id", async (req, res) => {
  let deleteProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deleteProduct) {
    res.status(400).json({ success: false, message: "Product not found" });
  }
  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
});

router.get("/get/count", async (req, res) => {
  let productCount = await Product.countDocuments();
  if (!productCount) {
    res.status(400).json({ succes: false });
  }
  res.send({
    productCount: productCount,
  });
});

// we want to get featured products data
router.get("/get/featured/:count", async (req, res) => {
  let count = req.params.count ? req.params.count : 0;
  let products = await Product.find({
    isFeatured: true,
  }).limit(+count);
  if (!products) {
    res.status(400).json({ succes: false });
  }
  res.send({
    products: products,
  });
});

module.exports = router;
