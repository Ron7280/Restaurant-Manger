const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
const prisma = require("../prismaClient.js");
const bcrypt = require("bcryptjs");

router.post("/signup", async (req, res) => {
  const { username, fname, lname, mobile, password } = req.body;

  if (!username || !fname || !lname || !mobile || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters",
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: `${fname} ${lname}`,
        username,
        mobile,
        password: hashedPassword,
        role: "customer",
      },
    });

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Account created successfully",
      token,
      userId: newUser.id,
      role: newUser.role,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      mobile: user.mobile,
      userId: user.id,
      role: user.role,
      username: user.username,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});
module.exports = router;
