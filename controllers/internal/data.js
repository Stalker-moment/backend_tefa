const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
const UAParser = require("ua-parser-js");
dotenv.config();

//const sendData = require("../../../functions/sendData");

router.get("/rack", async (req, res) => {
  const { authorization } = req.headers;
  const parser = new UAParser();
  const ua = req.headers["user-agent"];
  const deviceInfo = parser.setUA(ua).getResult();

  //console.log(deviceInfo);

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //provide all data rack
    const racks = await prisma.rack.findMany();

    res.status(200).json(racks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.error(error);
  }
});

router.get("/items", async (req, res) => {
  const { authorization } = req.headers;
  const parser = new UAParser();
  const ua = req.headers["user-agent"];
  const deviceInfo = parser.setUA(ua).getResult();

  //console.log(deviceInfo);

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //provide all data items
    const items = await prisma.item.findMany();

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.error(error);
  }
});

router.get("/category", async (req, res) => {
  const { authorization } = req.headers;
  const parser = new UAParser();
  const ua = req.headers["user-agent"];
  const deviceInfo = parser.setUA(ua).getResult();

  //console.log(deviceInfo);

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //provide all data category
    const category = await prisma.category.findMany();

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.error(error);
  }
});

module.exports = router;
