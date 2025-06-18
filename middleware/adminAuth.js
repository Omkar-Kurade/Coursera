require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_AdminSECRET;

function adminAuth(req, res, next) {}

module.exports = { adminAuth };
