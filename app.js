const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv/config");
app.use(cors());
app.options("*", cors());

const api = process.env.API_URL;

//Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");

app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);

const Product = require("./models/product");
const categories = require("./models/category");

//this connect method returns a promise and returns two methods ie then and error
// if then it is success and fails then error
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("database is connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(8000, () => {
  console.log(api);
  console.log("server is running on port 8000");
});
