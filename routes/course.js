const { Router } = require("express");
const { userAuth } = require("../middleware/userAuth");
const { purchasemodule, coursemodule } = require("../db");

const courseRouter = Router();
courseRouter.get("/preview", async (req, res) => {
  const course = await coursemodule.find({});
  res.json({
    course,
  });
});

courseRouter.post("/purchase", userAuth, async (req, res) => {
  const userId = req.userId;
  const courseId = req.body.courseId;

  await purchasemodule.create({
    userId,
    courseId,
  });

  res.json({
    message: "you have successfuliy bought the course",
  });
});

module.exports = { courseRouter: courseRouter };
