const User = require("../models/users");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(200).json({ success: false });
  }
  res.send(userList);
});

router.get("/:id", async (req, res) => {
  const userList = await User.findById(req.params.id).select("-passwordHash");

  if (!userList) {
    res.status(200).json({ success: false });
  }
  res.send(userList);
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      passwordHash,
      street,
      apartment,
      city,
      zip,
      country,
      phone,
      isAdmin,
    } = req.body;
    const hashedPassword = await bcrypt.hash(passwordHash, 10); //    // Create a new user instance
    const newUser = new User({
      name,
      email,
      passwordHash: hashedPassword,
      street: street || "",
      apartment: apartment || "",
      city: city || "",
      zip: zip || "",
      country: country || "",
      phone,
      isAdmin: isAdmin || false,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Respond with the saved user object
    res.status(201).json(savedUser);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
