const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
const { parse } = require("path");
dotenv.config();

router.post("/add", async (req, res) => {
  const { id, quantity } = req.body; // id refers to item id
  const { authorization } = req.headers;

  try {
    // Check authorization header
    if (!authorization) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({ error: "Token expired" });
    }

    const userId = decoded.id; // Extract user ID from token

    // Check if item exists
    const item = await prisma.item.findFirst({ where: { id: parseInt(id) } });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Check if user has a request order (cart)
    let requestOrder = await prisma.requestOrder.findFirst({
      where: { id: userId },
    });

    // If no request order, create one for the user
    if (!requestOrder) {
      requestOrder = await prisma.requestOrder.create({
        data: {
          user: {
            connect: {
              id: userId, // Connecting the user to the request order using their ID
            },
          },
          // You can add other fields here if necessary, but no need to specify 'id'
        },
      });
    }

    // Check if the item is already in the cart
    const existingOrderItem = await prisma.requestOrderItem.findFirst({
      where: {
        requestOrderId: userId,
        itemId: parseInt(id),
      },
    });

    //check quantity stock and quantity requested
    if (parseInt(quantity) > item.quantity) {
      return res
        .status(400)
        .json({ error: "Quantity requested exceeds stock" });
    }

    if (existingOrderItem) {
      if (existingOrderItem.quantity + parseInt(quantity) > item.quantity) {
        return res
          .status(400)
          .json({ error: "Quantity requested exceeds stock" });
      }
      // If item is already in the cart, update the quantity
      var added = await prisma.requestOrderItem.update({
        where: { id: existingOrderItem.id },
        data: {
          quantity: existingOrderItem.quantity + parseInt(quantity),
        },
      });
    } else {
      // If item is not in the cart, add it to the cart
      var added = await prisma.requestOrderItem.create({
        data: {
          itemId: parseInt(id),
          requestOrderId: userId,
          quantity: parseInt(quantity),
        },
      });
    }

    return res
      .status(200)
      .json({ message: "Item added to cart successfully", data: added });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/edit", async (req, res) => {
  const { id, quantity } = req.body;
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

    const userId = decoded.id;

    const existingOrderItem = await prisma.requestOrderItem.findFirst({
      where: {
        requestOrderId: userId,
        itemId: parseInt(id),
      },
    });

    if (!existingOrderItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    const item = await prisma.item.findFirst({ where: { id: parseInt(id) } });

    if (parseInt(quantity) > item.quantity) {
      return res
        .status(400)
        .json({ error: "Quantity requested exceeds stock" });
    }

    if (parseInt(quantity) === 0) {
      //delete item from cart
      await prisma.requestOrderItem.delete({
        where: { id: existingOrderItem.id },
      });

      return res.status(200).json({ message: "Item deleted from cart" });
    }

    const edited = await prisma.requestOrderItem.update({
      where: { id: existingOrderItem.id },
      data: {
        quantity: parseInt(quantity),
      },
    });

    return res
      .status(200)
      .json({ message: "Item quantity updated successfully", data: edited });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete", async (req, res) => {
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

    const userId = decoded.id;

    const existingOrderItem = await prisma.requestOrderItem.findFirst({
      where: {
        requestOrderId: userId,
        itemId: parseInt(id),
      },
    });

    if (!existingOrderItem) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    await prisma.requestOrderItem.delete({
      where: { id: existingOrderItem.id },
    });

    return res.status(200).json({ message: "Item deleted from cart" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/checkout", async (req, res) => {
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

    const userId = decoded.id;

    const requestOrder = await prisma.requestOrder.findFirst({
      where: { id: userId },
      include: { items: true },
    });

    if (!requestOrder) {
      return res.status(404).json({ error: "Cart is empty" });
    }

    if (requestOrder.items.length === 0) {
      return res.status(404).json({ error: "Cart is empty" });
    }

    const orderItems = requestOrder.items;

    // Create a new order
    const newOrder = await prisma.order.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        items: {
          create: orderItems.map((item) => ({
            item: {
              connect: {
                id: item.itemId,
              },
            },
            quantity: item.quantity,
          })),
        },
      },
    });

    // Delete the request order
    await prisma.requestOrderItem.deleteMany({
      where: { requestOrderId: userId },
    });

    return res
      .status(200)
      .json({ message: "Order placed successfully", data: newOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
