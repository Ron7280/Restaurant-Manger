require("dotenv").config();
const express = require("express");
const prisma = require("../prismaClient.js");
const router = express.Router();
const { authenticateToken } = require("../../middlewars/AuthToken.js");

router.post("/supply_purchase", authenticateToken, async (req, res) => {
  const { item_name, quantity, unit } = req.body;
  const ordered_by = req.user?.id || null;

  if (!item_name || !quantity || quantity <= 0) {
    return res.status(400).json({ success: false, error: "Invalid data" });
  }

  try {
    const purchase = await prisma.supplyPurchase.create({
      data: {
        ordered_by: ordered_by,
        item_name: item_name,
        quantity: quantity,
        unit: unit || null,
        status: "pending",
        updated_at: null,
      },
    });

    return res.json({ success: true, purchase });
  } catch (error) {
    console.error("Error inserting supply purchase:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/all_supply_purchase", authenticateToken, async (req, res) => {
  try {
    const purchases = await prisma.supplyPurchase.findMany({
      orderBy: { created_at: "desc" },
      include: {
        orderedBy: { select: { id: true, name: true } },
        buyer: { select: { id: true, name: true } },
      },
    });

    const purchasesWithImages = await Promise.all(
      purchases.map(async (p) => {
        const inventoryItem = await prisma.inventoryItem.findUnique({
          where: { name: p.item_name },
          select: { imageUrl: true },
        });

        return {
          ...p,
          imageUrl: inventoryItem?.imageUrl || null,
        };
      })
    );

    return res.json({ success: true, purchases: purchasesWithImages });
  } catch (error) {
    console.error("Error fetching supply purchases:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
