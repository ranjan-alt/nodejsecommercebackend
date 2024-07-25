function errorhandler(err, req, res, nest) {
  if (err.name === "UnauthorizedError") {
    return res.status(500).json({ message: "the user is not authorised" });
  }

  if (err.name === "ValidationError") {
    return res.status(401).json({ message: err });
  }

  return res.status(500).json({ message: err });
}

module.exports = errorhandler;
