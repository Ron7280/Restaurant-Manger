require("dotenv").config();
const express = require("express");
const prisma = require("../prismaClient.js");
const router = express.Router();
const { authenticateToken } = require("../../middlewars/AuthToken.js");

router.post("/order_now", authenticateToken, async (req, res) => {
  try {
    const { items, totalPrice } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: "pending",
        orderItems: {
          create: items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    res.json({ success: true, msg: "Your order has been sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.post("/delivery", authenticateToken, async (req, res) => {
  try {
    const { items, totalPrice, userId } = req.body;

    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: "pending",
        orderItems: {
          create: items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        },
      },
    });

    const delivery = await prisma.delivery.create({
      data: {
        orderId: order.id,
        status: "assigned",
        lat: null,
        lng: null,
      },
    });

    res.json({ success: true, msg: "Your delivery order has been sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create delivery order" });
  }
});

router.get("/my_orders", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.delete("/delete_my_order", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this order" });
    }

    await prisma.orderItem.deleteMany({ where: { orderId } });

    await prisma.order.delete({ where: { id: orderId } });

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

module.exports = router;
