require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const app = express();
const { allowedOrigins } = require("./API");
const prisma = require("./prismaClient");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to movie Restaurant project!");
});

app.get("/menu", async (req, res) => {
  const menuItems = await prisma.menuItem.findMany();
  res.json(menuItems);
});

app.use("/menu", require("./Routes/manageMenu.js"));
app.use("/auth", require("./Routes/Login.js"));

module.exports = app;
