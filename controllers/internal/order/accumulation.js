const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
const { parse } = require("path");
dotenv.config();

router.get("/cart", async (req, res) => {
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ error: "Token expired" });
    }

    const userId = decoded.id;

    const requestOrder = await prisma.requestOrder.findFirst({
      where: { id: userId },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!requestOrder) {
      return res.status(404).json({ error: "Cart not found" });
    }

    return res.status(200).json(requestOrder);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
