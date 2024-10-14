const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
dotenv.config();

const multer = require("multer");

// Set up multer storage with random filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./img/items");
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4();
    const fileExtension = file.originalname.split(".").pop();
    cb(null, `${uniqueName}.${fileExtension}`);
  },
});

const upload = multer({ storage: storage });

// For handling multiple files
router.post("/items/create", upload.array("pictures", 10), async (req, res) => {
  const { name, quantity, type, description, visible, price, rack, category } =
    req.body;

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ error: "Token expired" });
    }

    const role = decoded.role;
    if (role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const itemExist = await prisma.item.findFirst({ where: { name } });
    if (itemExist) {
      return res.status(400).json({ error: "Item already exists" });
    }

    const foundRack = await prisma.rack.findFirst({ where: { name: rack } });
    const foundCategory = await prisma.category.findFirst({
      where: { name: category },
    });
    if (!foundRack || !foundCategory) {
      return res.status(404).json({ error: "Rack or category not found" });
    }

    // Menyimpan gambar dengan nama file yang sesuai ID
    let pictures = [];
    if (req.files.length > 0) {
      pictures = await Promise.all(
        req.files.map(async (file) => {
          const pictureId = path.basename(
            file.filename,
            path.extname(file.filename)
          );
          return {
            id: pictureId, // Gunakan nama file sebagai ID gambar
            path: `/${file.filename}`,
            extension: path.extname(file.filename).slice(1),
          };
        })
      );
    } else {
      pictures = [{ id: uuidv4(), path: "/default.png", extension: "png" }];
    }

    const item = await prisma.item.create({
      data: {
        name,
        quantity: parseInt(quantity),
        type,
        description,
        visible: visible === "true",
        price: parseFloat(price),
        rack: { connect: { id: foundRack.id } },
        category: { connect: { id: foundCategory.id } },
        pictures: {
          create: pictures,
        },
      },
    });

    return res.status(201).json({ message: "Item created successfully", item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/items/edit", upload.array("pictures", 10), async (req, res) => {
  const {
    id,
    name,
    quantity,
    type,
    description,
    visible,
    price,
    rack,
    category,
    delpictures, // gambar yang ingin dihapus
  } = req.body;

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ error: "Token expired" });
    }

    const role = decoded.role;
    if (role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Cari item berdasarkan ID
    const itemExist = await prisma.item.findFirst({
      where: { id: parseInt(id) },
    });

    if (!itemExist) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Cek rak dan kategori
    const foundRack = await prisma.rack.findFirst({ where: { name: rack } });
    const foundCategory = await prisma.category.findFirst({
      where: { name: category },
    });

    if (!foundRack || !foundCategory) {
      return res.status(404).json({ error: "Rack or category not found" });
    }

    const updatedData = {
      name: name || itemExist.name,
      quantity: quantity ? parseInt(quantity) : itemExist.quantity,
      type: type || itemExist.type,
      description: description || itemExist.description,
      visible:
        visible === "true"
          ? true
          : visible === "false"
          ? false
          : itemExist.visible,
      price: price ? parseFloat(price) : itemExist.price,
      rack: { connect: { id: foundRack.id } },
      category: { connect: { id: foundCategory.id } },
    };

    // Jika ada gambar baru, tambahkan gambar baru dengan penamaan berdasarkan id dari gambar di database
    if (req.files && req.files.length > 0) {
      const pictures = await Promise.all(
        req.files.map(async (file) => {
          const pictureId = uuidv4(); // Buat UUID baru untuk gambar baru
          const fileExtension = path.extname(file.originalname).slice(1);

          const newFileName = `${pictureId}.${fileExtension}`; // Nama file berdasarkan UUID
          const filePath = path.join("./img/items", newFileName);

          // Pindahkan file ke path yang sesuai
          fs.renameSync(file.path, filePath);

          return {
            id: pictureId,
            path: `/${newFileName}`, // Simpan path gambar baru
            extension: fileExtension,
          };
        })
      );

      updatedData.pictures = {
        create: pictures,
      };
    }

    // Menghapus gambar yang dihapus dari database dan folder
    if (delpictures) {
      const picturesToDelete = Array.isArray(delpictures)
        ? delpictures
        : [delpictures]; // pastikan menjadi array

      // Query untuk menghapus gambar dari database berdasarkan UUID
      await prisma.picture.deleteMany({
        where: {
          id: { in: picturesToDelete }, // Hapus berdasarkan UUID
        },
      });

      // Hapus file gambar dari folder
      picturesToDelete.forEach((pictureUUID) => {
        const picturePath = path.join(
          __dirname,
          "../../../img/items",
          `${pictureUUID}`
        );
        if (fs.existsSync(picturePath)) {
          fs.unlinkSync(picturePath);
        }
      });
    }

    // Update item dengan data baru
    const item = await prisma.item.update({
      where: { id: parseInt(id) },
      include: { pictures: true },
      data: updatedData,
    });

    return res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/items/delete", async (req, res) => {
  const { id } = req.body;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ error: "Token expired" });
    }

    const role = decoded.role;
    if (role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const itemExist = await prisma.item.findFirst({
      where: { id: parseInt(id) },
    });

    if (!itemExist) {
      return res.status(404).json({ error: "Item not found" });
    }

    await prisma.item.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
