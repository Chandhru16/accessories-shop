const jwt = require("jsonwebtoken");

const verifyToken = (requiredRole) => (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token." });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

exports.requireCustomer = verifyToken("customer");
exports.requireOwner = verifyToken("owner");
