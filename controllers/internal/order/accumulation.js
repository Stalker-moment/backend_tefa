const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

// URL dasar untuk gambar, sesuaikan dengan lokasi gambar disimpan
const baseUrl = "https://apitefa.akti.cloud/files/img/items";

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

    // Query untuk mengambil requestOrder beserta item dan gambar
    const requestOrder = await prisma.requestOrder.findFirst({
      where: { id: userId },
      include: {
        items: {
          include: {
            item: {
              include: {
                pictures: true, // Sertakan gambar dalam item
              },
            },
          },
        },
      },
    });

    if (!requestOrder) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Modifikasi setiap item untuk menambahkan URL gambar, quantity dari RequestOrderItem, dan stock dari Item utama
    const itemsWithDetails = requestOrder.items.map(orderItem => {
      const item = orderItem.item;
      const picturesWithUrl = item.pictures.map(picture => {
        return {
          ...picture,
          fullPath: `${baseUrl}${picture.path}`, // Tambahkan URL ke path gambar
        };
      });

      return {
        ...item,
        pictures: picturesWithUrl,     // Gantikan gambar lama dengan yang sudah ada fullPath
        quantity: orderItem.quantity,  // Ambil quantity dari RequestOrderItem
        stock: item.quantity,          // Ambil stock dari quantity di Item utama
      };
    });

    // Kembalikan data dengan item yang sudah dimodifikasi
    return res.status(200).json({
      ...requestOrder,
      items: itemsWithDetails, // Update items dengan gambar, quantity, dan stock
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;