const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const tokenBlacklist = require("./tokenBlacklist");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  const authHeader = req.headers.authorization;
  if (authHeader) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    console.log('Auth error: No token provided');
    return res.status(403).json({ message: "No token provided!", error: "No token provided!" });
  }

  // Check if token is blacklisted
  if (tokenBlacklist.isBlacklisted(token)) {
    console.log('Auth error: Token has been revoked');
    return res.status(401).json({ message: "Token has been revoked!", error: "Token has been revoked!" });
  }

  jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) {
      console.log('Auth error:', err.message);
      return res.status(401).json({ message: "Unauthorized! Invalid or expired token.", error: err.message });
    }
    req.userId = decoded.id;
    req.token = token; // Store token for logout
    next();
  });
};

const authCheck = {
  verifyToken,
};
module.exports = authCheck;
