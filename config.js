require("dotenv").config();
const port = process.env.PORT;
const db = process.env.DB_URL;

module.exports = { port, db };
