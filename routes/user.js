require("dotenv").config();
const express = require("express");
const { Router } = require("express");
const { usermodule } = require("../db");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_UsersSECRET;

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
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

  const parsedData = requiredBody.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Incorrect Formate",
      // Error: parsedData.error.errors.map((err) => err.message),
    });
    return;
  }

  const { email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 5); //5 represent salt for more check bcrypt on npm

    await usermodule.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    res.status(201).json({
      Message: "user registered successfully",
      // hashedPassword: hashedPassword,
    });
  } catch (e) {
    res.json({
      message: "Registration failed",
    });
  }
});

userRouter.post("/signin", async (req, res) => {
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

  const user = await usermodule.findOne({
    email: email,
  });

  if (!user) {
    res.json({
      message: "User not found ",
    });
    return;
  }

  const passwordMatch = bcrypt.compare(password, user.password);

  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: user._id.toString(),
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

userRouter.get("/purchases", (req, res) => {});

module.exports = { userRouter: userRouter };
