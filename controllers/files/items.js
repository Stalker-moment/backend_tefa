const express = require("express");
const fs = require("fs");
const router = express.Router();
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/img/items/:name", (req, res) => {
  const name = req.params.name;

  const filePath = `./img/items/${name}`;
  if (fs.existsSync(filePath)) {
    res.sendFile(path.resolve(filePath));
  } else {
    res.sendFile(path.resolve("./img/nofound.jpg"));
  }
});

router.delete("/img/items", async (req, res) => {
  const { name } = req.body;

  try {
    // Detect if name is an array
    if (Array.isArray(name)) {
      // Get the file information from the database to include extensions
      const files = await prisma.picture.findMany({
        where: {
          id: {
            in: name,
          },
        },
        select: {
          id: true,
          extension: true, // Assuming you store file extension in the database
        },
      });

      if (files.length > 0) {
        // Delete the files from the database
        const deletedImages = await prisma.picture.deleteMany({
          where: {
            id: {
              in: name,
            },
          },
        });

        if (deletedImages.count > 0) {
          // Use Promise.all to handle async file deletion
          await Promise.all(
            files.map(async (file) => {
              const filePath = path.join(__dirname, `../../img/items/${file.id}.${file.extension}`);
              console.log(filePath);
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(

                  `File ${file.id}.${file.extension} deleted successfully.`
                );
              } else {
                console.log(
                  `File ${file.id}.${file.extension} not found on disk.`
                );
              }
            })
          );
        } else {
          return res.status(404).json({ error: "Files not found in database" });
        }

        return res.status(200).json({ message: "Files deleted successfully" });
      } else {
        return res.status(404).json({ error: "Files not found in database" });
      }
    }

    // Single file deletion
    const file = await prisma.picture.findUnique({
      where: {
        id: name,
      },
      select: {
        id: true,
        extension: true,
      },
    });

    if (file) {
      const filePath = path.join(__dirname, `../../img/items/${file.id}.${file.extension}`);
      console.log(filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`File ${file.id}.${file.extension} deleted successfully.`);
      } else {
        console.log(`File ${file.id}.${file.extension} not found on disk.`);
      }

      await prisma.picture.delete({
        where: {
          id: name,
        },
      });

      return res.status(200).json({ message: "File deleted successfully" });
    } else {
      return res.status(404).json({ error: "File not found in database" });
    }
  } catch (error) {
    console.error("Error during file deletion:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
