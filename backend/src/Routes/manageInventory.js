const express = require("express");
const prisma = require("../prismaClient");
const router = express.Router();
const { authenticateToken } = require("../../middlewars/AuthToken.js");

router.get("/inventory_items", authenticateToken, async (req, res) => {
  try {
    const inventoryItems = await prisma.inventoryItem.findMany();
    res.status(200).json(inventoryItems);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    res.status(500).json({ error: "Failed to fetch inventory items" });
  }
});

router.post("/add_item", authenticateToken, async (req, res) => {
  const { itemData } = req.body;

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

  try {
    const newItem = await prisma.inventoryItem.create({
      data: {
        name: itemData.name,
        quantity: itemData.quantity,
        unit: itemData.unit || null,
        category: itemData.category,
        imageUrl: itemData.imageUrl || null,
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding inventory item:", error);
    res.status(500).json({ error: "Failed to add inventory item" });
  }
});

// router.put("/inventory/:id", async (req, res) => {
//   const { id } = req.params;
//   const { name, quantity, unit } = req.body;

//   if (!name || !quantity || !unit) {
//     return res
//       .status(400)
//       .json({ error: "Name, quantity, and unit are required" });
//   }

//   try {
//     const updatedItem = await prisma.inventoryItem.update({
//       where: { id },
//       data: {
//         name,
//         quantity,
//         unit,
//       },
//     });
//     res.status(200).json(updatedItem);
//   } catch (error) {
//     console.error("Error updating inventory item:", error);
//     res.status(500).json({ error: "Failed to update inventory item" });
//   }
// });

// router.delete("/inventory/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedItem = await prisma.inventoryItem.delete({
//       where: { id },
//     });
//     res.status(200).json(deletedItem);
//   } catch (error) {
//     console.error("Error deleting inventory item:", error);
//     res.status(500).json({ error: "Failed to delete inventory item" });
//   }
// });

module.exports = router;
