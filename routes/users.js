const User = require("../models/users");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

// router.post("/", async (req, res) => {
//   try {
//     let {
//       name,
//       email,
//       passwordHash,
//       street,
//       apartment,
//       city,
//       zip,
//       country,
//       phone,
//       isAdmin,
//     } = req.body;
//     const hashedPassword = await bcrypt.hash(passwordHash, 10); //    // Create a new user instance
//     let newUser = new User({
//       name,
//       email,
//       passwordHash: hashedPassword,
//       street: street || "",
//       apartment: apartment || "",
//       city: city || "",
//       zip: zip || "",
//       country: country || "",
//       phone,
//       isAdmin: isAdmin || false,
//     });

//     // Save the user to the database
//     const savedUser = await newUser.save();

//     // Respond with the saved user object
//     res.status(201).json(savedUser);
//   } catch (error) {
//     // Handle any errors
//     res.status(500).json({ error: error.message });
//   }
// });

router.post("/login", async (req, res) => {
  // we will first see if this users exist
  const { email, password } = req.body;
  const secret = process.env.secret;
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("The User not found");
  }
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (isMatch) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );
    return res.status(200).send({ user: user.email, token: token });
  } else {
    return res.status(200).send("password is wrong");
  }
  return res.status(200).send(user);
});

router.post("/register", async (req, res) => {
  let {
    name,
    email,
    password,
    street,
    apartment,
    city,
    zip,
    country,
    phone,
    isAdmin,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  let newUser = new User({
    name: name,
    email: email,
    passwordHash: hashedPassword,
    street: street || "",
    apartment: apartment || "",
    city: city || "",
    zip: zip || "",
    country: country || "",
    phone: phone,
    isAdmin: isAdmin || false,
  });
  newUser
    .save()
    .then((savedUser) => {
      console.log("User saved successfully:", savedUser);
      res.status(201).json(savedUser); // Respond with saved user object
    })
    .catch((error) => {
      console.error("Error saving user:", error);
      res.status(500).json({ error: error.message }); // Handle error response
    });
});

module.exports = router;
