const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

router.post("/register", async (req, res) => {
  const { email, password, role, firstName, lastName, phone } = req.body;
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!email || !password || !role || !firstName || !lastName || !phone) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    if (role !== "admin" && role !== "user") {
      return res.status(400).json({ error: "Invalid role" });
    }

    const account = await prisma.account.findUnique({
      where: {
        email: email,
      },
    });

    if (account) {
      return res.status(400).json({ error: "Account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = await prisma.account.create({
      data: {
        email: email,
        password: hashedPassword,
        role: role,
        contact: {
          create: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
          },
        },
      },
    });

    if (!newAccount) {
      return res.status(500).json({ error: "Failed to create account" });
    }

    return res.status(201).json({ message: "Account created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;