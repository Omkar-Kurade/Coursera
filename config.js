require("dotenv").config();
const port = process.env.PORT;
const db = process.env.DB_URL;
const userSecret = process.env.JWT_UsersSECRET;
const adminSecret = process.env.JWT_AdminSECRET;

module.exports = { port, db, userSecret, adminSecret };
