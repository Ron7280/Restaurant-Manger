require("dotenv").config();
const express = require("express");
const prisma = require("../prismaClient.js");
const router = express.Router();
const { authenticateToken } = require("../../middlewars/AuthToken.js");

function generateSerialNum() {
  const chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let serialNum = "";
  for (let i = 0; i < 8; i++) {
    serialNum += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return serialNum;
}

async function generateUniqueSerialNum() {
  let serialNum;
  let exists;

  do {
    serialNum = generateSerialNum();
    exists = await prisma.order.findUnique({
      where: { serialNum },
    });
  } while (exists);

  return serialNum;
}

router.post("/delivery", authenticateToken, async (req, res) => {
  try {
    const { items, totalPrice, type, mobile, lat, lng } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User not authenticated" });
    }

    const serialNum = await generateUniqueSerialNum();

    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        type,
        serialNum,
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
        status: "pending",
        mobile,
        lat,
        lng,
      },
    });

    res.json({ success: true, msg: "Your delivery order has been sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create delivery order" });
  }
});

router.post("/assign_delivery", authenticateToken, async (req, res) => {
  try {
    const { orderId, userId } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "delivery") {
      return res.status(400).json({ error: "Invalid delivery user" });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "assigned" },
    });

    const delivery = await prisma.delivery.update({
      where: { orderId: orderId },
      data: { driverId: userId, status: "assigned" },
    });

    res.json({ success: true, driverName: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign delivery" });
  }
});

router.get("/my_delivery", authenticateToken, async (req, res) => {
  try {
    const driverId = req.user.id;

    const deliveries = await prisma.delivery.findMany({
      where: { driverId },
      orderBy: { updatedAt: "desc" },
      include: {
        order: {
          include: {
            customer: true,
            orderItems: {
              include: {
                menuItem: true,
              },
            },
          },
        },
      },
    });

    const result = deliveries.map((d) => ({
      id: d.id,
      orderId: d.orderId,
      serialNum: d.order.serialNum,
      status: d.status,
      driverId: d.driverId,
      delivered: d.delivered,
      delivered_at: d.delivered_at,
      lat: d.lat,
      lng: d.lng,
      updatedAt: d.updatedAt,
      customerName: d.order.customer.name,
      customerMobile: d.order.customer.mobile,
      items: d.order.orderItems.map((oi) => ({
        id: oi.id,
        name: oi.menuItem.name,
        description: oi.menuItem.description,
        price: oi.menuItem.price,
        imageUrl: oi.menuItem.imageUrl,
        quantity: oi.quantity,
      })),
      totalPrice: d.order.totalPrice,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch deliveries" });
  }
});

router.put("/delivering", authenticateToken, async (req, res) => {
  const { orderId } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "delivering",
      },
    });

    const updatedDelivery = await prisma.delivery.update({
      where: { orderId: orderId },
      data: {
        status: "delivering",
        delivered: false,
      },
    });

    res.json({ success: true, msg: "Delivery marked as delivering" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update delivery status" });
  }
});

router.put("/delivered", authenticateToken, async (req, res) => {
  const { orderId } = req.body;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "delivered",
      },
    });

    const updatedDelivery = await prisma.delivery.update({
      where: { orderId: orderId },
      data: {
        status: "delivered",
        delivered: true,
        delivered_at: new Date(),
      },
    });

    res.json({ success: true, msg: "Delivery marked as delivered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update delivery status" });
  }
});

module.exports = router;
