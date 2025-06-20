const jwt = require("jsonwebtoken");
const { adminSecret } = require("../config");

function adminAuth(req, res, next) {
  const token = req.headers.token;
  const decodedToken = jwt.verify(token, adminSecret);

  if (decodedToken) {
    req.adminId = decodedToken.id;
    next();
  } else {
    res.status(403).json({
      message: "You are not signed in!",
    });
  }
}

module.exports = { adminAuth };
