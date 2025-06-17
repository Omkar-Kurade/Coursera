const { Router } = require("express");

const courseRouter = Router();
courseRouter.get("/preview", (req, res) => {
  res.json({
    message: "Course/preview endpoint ",
  });
});
courseRouter.post("/purchase", (req, res) => {});

module.exports = { courseRouter: courseRouter };
