const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

router.post("/rack/create", async (req, res) => {
  const { name, subName, location } = req.body;
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const role = decoded.role;

    if (role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const newRack = await prisma.rack.create({
      data: {
        name: name,
        subName: subName,
        location: location,
      },
    });

    return res
      .status(201)
      .json({ message: "Rack created successfully", data: newRack });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/rack/edit", async (req, res) => {
  const { id, name, subName, location } = req.body;
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const role = decoded.role;

    if (role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const rack = await prisma.rack.findUnique({
      where: {
        id: id,
      },
    });

    if (!rack) {
      return res.status(404).json({ error: "Rack not found" });
    }

    //just detect the value of edited field
    let rackname = rack.name;
    let racksubName = rack.subName;
    let racklocation = rack.location;

    if (name) {
      rackname = name;
    }

    if (subName) {
      racksubName = subName;
    }

    if (location) {
      racklocation = location;
    }

    const updatedRack = await prisma.rack.update({
      where: {
        id: id,
      },
      data: {
        name: rackname,
        subName: racksubName,
        location: racklocation,
      },
    });

    return res
      .status(200)
      .json({ message: "Rack updated successfully", data: updatedRack });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/rack/delete", async (req, res) => {
  const { id } = req.body;
  const { authorization } = req.headers;

  try {
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.expired < Date.now()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const role = decoded.role;

    if (role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const rack = await prisma.rack.findUnique({
      where: {
        id: id,
      },
    });

    if (!rack) {
      return res.status(404).json({ error: "Rack not found" });
    }

    //check items in rack (if any item exist in rack, it can't be deleted)
    const items = await prisma.item.findMany({
      where: {
        rackId: id,
      },
    });

    if (items.length > 0) {
      return res
        .status(400)
        .json({ error: "Rack can't be deleted, items exist in rack, please move items to others rack" });
    }

    await prisma.rack.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({ message: "Rack deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
