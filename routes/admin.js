require("dotenv").config();
const { Router } = require("express");
const { adminmodule } = require("../db");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_AdminSECRET;

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
      secret
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

adminRouter.post("/course", (req, res) => {
  res.json({
    message: " admin Create a course",
  });
});

adminRouter.put("/course", (req, res) => {
  res.json({
    message: " admin Create a course",
  });
});
adminRouter.get("/course/bulk", (req, res) => {
  res.json({
    message: " admin Create a course",
  });
});

module.exports = { adminRouter: adminRouter };
