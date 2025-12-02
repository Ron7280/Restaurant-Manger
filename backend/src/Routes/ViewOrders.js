const express = require("express");
const prisma = require("../prismaClient");
const router = express.Router();
const { authenticateToken } = require("../../middlewars/AuthToken.js");
const upload = require("../../middlewars/SaveImages.js");

module.exports = router;
