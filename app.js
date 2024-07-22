const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv/config");
const api = process.env.API_URL;

//Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
const productsRouter = require("./routers/products");

app.use(`${api}/products`, productsRouter);

const Product = require("./models/product");

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
