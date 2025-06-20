const { Router } = require("express");
const { adminmodule, coursemodule } = require("../db");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { adminSecret } = require("../config");
const { adminAuth } = require("../middleware/adminAuth");
const { Types } = require("mongoose");
const ObjectId = Types.ObjectId;

const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().email().min(3).max(100),
    password: z
      .string()
      .min(6)
      .max(30)
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number",
      })
      .refine((val) => /[@$!%*?&]/.test(val), {
        message:
          "Password must contain at least one special character (@$!%*?&)",
      }),
    firstName: z.string().min(3).max(100),
    lastName: z.string().min(3).max(100),
  });

  const parcedData = requiredBody.safeParse(req.body);

  if (!parcedData.success) {
    res.json({
      message: "Incorrect Formate",
      Error: parcedData.error.errors.map((err) => err.message),
    });
  }

  const { email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 5);

    await adminmodule.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    res.status(201).json({
      Message: "Admin registered successfully",
      // hashedPassword: hashedPassword,
    });
  } catch (e) {
    res.json({
      message: "Admin with this email id already Exist",
    });
  }
});

adminRouter.post("/signin", async (req, res) => {
  const requireBody = z.object({
    email: z.string().email().min(3).max(100),
    password: z.string().min(6).max(30),
  });

  const parsedData = requireBody.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect formet ",
      Error: parsedData.error.errors.map((err) => err.message),
    });
  }

  const { email, password } = req.body;

  const admin = await adminmodule.findOne({
    email: email,
  });

  if (!admin) {
    res.json({
      message: "Admin not found ",
    });
    return;
  }

  const passwordMatch = bcrypt.compare(password, admin.password);

  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: admin._id.toString(),
      },
      adminSecret
    );
    res.json({
      Message: "You are Successfuly login",
      token: token, //Comment this After testing
    });
  } else {
    res.status(403).json({
      Message: "Incorrect Email or Password ",
    });
  }
});

adminRouter.post("/course", adminAuth, async (req, res) => {
  const adminId = req.adminId;
  const requiredBody = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    imageUrl: z.string(),
  });

  const parcedData = requiredBody.safeParse(req.body);
  if (!parcedData.success) {
    return res.status(400).json({
      message: "Incorrect Formate",
      Error: parcedData.error.errors.map((err) => err.message),
    });
  }

  const { title, description, price, imageUrl } = req.body;

  try {
    const course = await coursemodule.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      createrId: adminId,
    });

    res.json({
      message: "Course Created",
      courseId: course._id,
    });
  } catch (error) {
    res.json({
      message: "Unable to create Course",
    });
  }
});

adminRouter.put("/course", adminAuth, async (req, res) => {
  const adminId = req.adminId;

  const requiredBody = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    imageUrl: z.string(),
    courseId: z.string().refine((val) => ObjectId.isValid(val), {
      message: "Invalid courseId format (must be a valid ObjectId)",
    }),
  });

  const parcedData = requiredBody.safeParse(req.body);
  if (!parcedData.success) {
    return res.status(400).json({
      message: "Incorrect Formate",
      Error: parcedData.error.errors.map((err) => err.message),
    });
  }

  const { title, description, price, imageUrl, courseId } = req.body;

  const course = await coursemodule.updateOne(
    { _id: courseId, createrId: adminId },
    {
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
    }
  );

  res.json({
    message: "Course Updated!",
    courseId: course._id,
  });
});
adminRouter.get("/course/bulk", adminAuth, async (req, res) => {
  const adminId = req.adminId;

  try {
    const courses = await coursemodule.find({
      createrId: adminId,
    });
    res.json({
      courses,
    });
  } catch (error) {
    res.status(404).json({
      message: `${error} "Courses not Found "`,
    });
  }
});

module.exports = { adminRouter: adminRouter };
