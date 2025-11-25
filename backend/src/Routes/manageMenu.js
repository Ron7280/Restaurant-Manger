require("dotenv").config();
const express = require("express");
const prisma = require("../prismaClient.js");
const router = express.Router();

router.get("/fetch_menu", async (req, res) => {
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

router.post("/save_new", async (req, res) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    if (!name || price == null)
      return res.status(400).json({ error: "Name and price are required" });

    const menuItem = await prisma.menuItem.create({
      data: { name, description, price, imageUrl },
    });

    res.status(201).json(menuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create menu item" });
  }
});

router.put("/update_menu", async (req, res) => {
  try {
    const { payload, id } = req.body;

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        imageUrl: payload.imageUrl || null,
      },
    });

    res.json(menuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

router.delete("/delete_menu", async (req, res) => {
  try {
    const { id } = req.params;

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
