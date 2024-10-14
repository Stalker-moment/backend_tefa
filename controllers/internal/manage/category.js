const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

router.post("/category/create", async (req, res) => {
  const { name } = req.body;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token expiration check (decoded.exp is in seconds, so convert Date.now to seconds)
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ error: "Token expired" });
    }

    const role = decoded.role;
    if (role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Check if the category already exists
    const categoryExist = await prisma.category.findFirst({
      where: { name: name },
    });

    if (categoryExist) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name,
      },
    });

    return res.status(200).json(newCategory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/category/edit", async (req, res) => {
  const { id, name } = req.body;
  const { authorization } = req.headers;

  //console.log(id, name);

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token expiration check (decoded.exp is in seconds, so convert Date.now to seconds)
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ error: "Token expired" });
    }

    const role = decoded.role;
    if (role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const categoryExist = await prisma.category.findFirst({
      where: { id: id },
    });

    if (!categoryExist) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: id },
      data: {
        name: name,
      },
    });

    //console.log(updatedCategory);

    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/category/delete", async (req, res) => {
  const { id } = req.body;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token expiration check (decoded.exp is in seconds, so convert Date.now to seconds)
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ error: "Token expired" });
    }

    const role = decoded.role;
    if (role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const categoryExist = await prisma.category.findFirst({
      where: { id: id },
    });

    if (!categoryExist) {
      return res.status(404).json({ error: "Category not found" });
    }

    const deletedCategory = await prisma.category.delete({
      where: { id: id },
    });

    return res.status(200).json(deletedCategory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
