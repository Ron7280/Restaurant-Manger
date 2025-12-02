const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
const prisma = require("../prismaClient.js");

// router.post("/login", async (req, res) => {
//   const { username, fname, lname, password } = req.body;

//   if (!username || !fname || !lname || !password) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   if (password.length < 8) {
//     return res
//       .status(400)
//       .json({ error: "Password must be at least 8 characters" });
//   }

//   try {
//     let user = await prisma.user.findUnique({ where: { username: username } });

//     if (!user) {
//       user = await prisma.user.create({
//         data: {
//           name: `${fname} ${lname}`,
//           username: username,
//           password,
//           role: "customer",
//         },
//       });
//     }

//     const token = jwt.sign(
//       { id: user.id, username: user.username },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );

//     res.json({ token, userId: user.id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Login failed" });
//   }
// });

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      userId: user.id,
      role: user.role,
      username: user.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
