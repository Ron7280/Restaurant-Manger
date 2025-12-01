require("dotenv").config();
const express = require("express");
const prisma = require("../prismaClient.js");
const router = express.Router();
const { authenticateToken } = require("../../middlewars/AuthToken.js");
const upload = require("../../middlewars/SaveImages.js");

router.get("/fetch_menu", authenticateToken, async (req, res) => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      include: { ingredients: true },
      orderBy: { name: "asc" },
    });
    res.json(menuItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

router.post(
  "/save_new",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const { name, description, price, category } = req.body;

    const parsedPrice = parseFloat(price);

    if (isNaN(parsedPrice)) {
      return res.status(400).json({ error: "Invalid price" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      if (!name || price == null) {
        return res.status(400).json({ error: "Name and price are required" });
      }

      if (!category) {
        return res.status(400).json({ error: "Category is required" });
      }

      const menuItem = await prisma.menuItem.create({
        data: {
          name,
          description,
          price: parsedPrice,
          imageUrl,
          category,
        },
      });

      res.status(201).json(menuItem);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create menu item" });
    }
  }
);

router.put(
  "/update_menu",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const { name, description, price, category, id } = req.body;

    const parsedPrice = parseFloat(price);

    if (isNaN(parsedPrice)) {
      return res.status(400).json({ error: "Invalid price" });
    }

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl;

    try {
      if (!name || parsedPrice == null) {
        return res.status(400).json({ error: "Name and price are required" });
      }

      if (!category) {
        return res.status(400).json({ error: "Category is required" });
      }

      const menuItem = await prisma.menuItem.update({
        where: { id },
        data: {
          name,
          description,
          price: parsedPrice,
          imageUrl,
          category,
        },
      });

      res.json(menuItem);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update menu item" });
    }
  }
);

router.post("/delete_menu", authenticateToken, async (req, res) => {
  const { id } = req.body;
  try {
    await prisma.menuItem.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

module.exports = router;
