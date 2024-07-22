const express = require("express");
const router = express.Router();

const Product = require("../models/product");
router.get(`/`, async (req, res) => {
  //we got since find method is returning a promise and i am sending response maybe this productList is not ready yet
  // to get off this error we have to use async await
  const productList = await Product.find();
  // if any issue happens while getting productList
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.status(200).json({ productList });
});

router.post(`/addProduct`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });
  product
    .save()
    .then((createdProduct) => {
      res.status(200).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: "fail",
      });
    });
});

module.exports = router;
