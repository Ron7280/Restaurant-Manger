require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const csrf = require("csurf");
const multer = require("multer");
const app = express();
const { allowedOrigins } = require("./API");
const prisma = require("./prismaClient");
const path = require("path");

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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const csrfProtection = csrf({
  cookie: true,
  value: (req) => req.body.csrfToken,
});

app.get("/auth/csrf_token", csrfProtection, async (req, res) => {
  const token = req.csrfToken();
  res.json({ csrfToken: token });
});

app.get("/", (req, res) => {
  res.send("Welcome to movie Restaurant project!");
});

app.get("/menu", async (req, res) => {
  const menuItems = await prisma.menuItem.findMany();
  res.json(menuItems);
});

app.use("/menu", require("./Routes/manageMenu.js"));

module.exports = app;
