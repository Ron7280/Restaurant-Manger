const express = require("express");
const prisma = require("../prismaClient");
const router = express.Router();
const { authenticateToken } = require("../../middlewars/AuthToken.js");
const upload = require("../../middlewars/SaveImages.js");

router.get("/inventory_items", authenticateToken, async (req, res) => {
  try {
    const inventoryItems = await prisma.inventoryItem.findMany();
    res.status(200).json(inventoryItems);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    res.status(500).json({ error: "Failed to fetch inventory items" });
  }
});

router.post(
  "/add_item",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    let itemData;
    try {
      itemData = JSON.parse(req.body.itemData);
    } catch (error) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    if (
      !itemData.name ||
      !itemData.quantity ||
      !itemData.unit ||
      !itemData.category
    ) {
      return res
        .status(400)
        .json({ error: "Name, quantity, category, and unit are required" });
    }

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : itemData.imageUrl || null;

    try {
      const newItem = await prisma.inventoryItem.create({
        data: {
          name: itemData.name,
          quantity: itemData.quantity,
          unit: itemData.unit,
          category: itemData.category,
          imageUrl,
        },
      });
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error adding inventory item:", error);
      res.status(500).json({ error: "Failed to add inventory item" });
    }
  }
);

router.put(
  "/edit_item",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    let updatedItem;
    try {
      updatedItem = JSON.parse(req.body.updatedItem);
    } catch (error) {
      return res.status(400).json({ error: "Invalid data format" });
    }
    console.log("updatedItem --> ", updatedItem);
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!updatedItem.name || !updatedItem.quantity || !updatedItem.unit) {
      return res
        .status(400)
        .json({ error: "Name, quantity, and unit are required" });
    }

    try {
      const updatedItemResponse = await prisma.inventoryItem.update({
        where: { id: updatedItem.id },
        data: {
          name: updatedItem.name,
          quantity: updatedItem.quantity,
          unit: updatedItem.unit,
          category: updatedItem.category,
          imageUrl: imageUrl || updatedItem.imageUrl,
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating inventory item:", error);
      res.status(500).json({ error: "Failed to update inventory item" });
    }
  }
);

router.delete("/delete_item", authenticateToken, async (req, res) => {
  const { id } = req.body;
  console.log("id ", id);

  try {
    const itemToDelete = await prisma.inventoryItem.findUnique({
      where: { id },
    });

    if (!itemToDelete) {
      return res.status(404).json({ error: "Item not found" });
    }

    await prisma.inventoryItem.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    res.status(500).json({ error: "Failed to delete inventory item" });
  }
});

module.exports = router;
