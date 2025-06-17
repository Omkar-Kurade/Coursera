require("dotenv").config();
const express = require("express");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const mongoose = require("mongoose");

const port = process.env.PORT;
const db = process.env.DB_URL;

const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

async function main() {
  try {
    await mongoose.connect(db);
    console.log("✅ Connected to MongoDB");

    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
}

main();
