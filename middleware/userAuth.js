const jwt = require("jsonwebtoken");
const { userSecret } = require("../config");
function userAuth(req, res, next) {
  const token = req.headers.token;
  const decodedToken = jwt.verify(token, userSecret);

  if (decodedToken) {
    req.userId = decodedToken.id;
    next();
  } else {
    res.status(403).json({
      message: "You are not signed in!",
    });
  }
}

module.exports = { userAuth };
