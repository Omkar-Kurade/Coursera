require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_UsersSECRET;

function userAuth(req, res, next) {}

module.exports = { userAuth };
