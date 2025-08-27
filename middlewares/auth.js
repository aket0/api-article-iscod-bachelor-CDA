const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../api/users/users.model");

module.exports = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];
    if (!token) throw new Error("Token not provided");

    const decoded = jwt.verify(token, config.secretJwtToken);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) throw new Error("User not found");

    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedError(error.message || "Invalid or expired token"));
  }
};
