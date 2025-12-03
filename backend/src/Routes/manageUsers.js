const express = require("express");
const prisma = require("../prismaClient.js");
const router = express.Router();
const { authenticateToken } = require("../../middlewars/AuthToken.js");
const upload = require("../../middlewars/SaveUserImage.js");

router.get("/all_users", authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({});

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.put(
  "/update_user",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const form = req.body;

    const bannedStatus =
      form.banned === "true"
        ? true
        : form.banned === "false"
        ? false
        : form.banned;

    let imageUrl = req.file
      ? `/uploads/Users/${req.file.filename}`
      : form.imageUrl || null;

    try {
      const updatedUser = await prisma.user.update({
        where: { id: form.id },
        data: {
          name: form.name,
          role: form.role,
          username: form.username,
          password: form.password,
          imageUrl: imageUrl,
          banned: bannedStatus,
        },
      });
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

module.exports = router;
