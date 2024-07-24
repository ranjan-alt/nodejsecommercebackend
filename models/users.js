const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    // required: true,
    default: "",
  },
  apartment: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    // required: true,
    default: "",
  },
  zip: {
    type: String,
    // required: true,
    default: "",
  },
  country: {
    type: String,
    // required: true,
    default: "",
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true,
});
const User = mongoose.model("User", userSchema);

module.exports = User;
