const express = require("express");
const fs = require("fs");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const uuid = require("uuid");
const dotenv = require("dotenv");
dotenv.config();

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./img/cover"); // Set the destination folder for the uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueName = uuid.v4();
    const extension = file.originalname.split(".").pop();
    cb(null, `${uniqueName}.${extension}`); // Keep the original file name
  },
});

// Initialize multer with the defined storage
const upload = multer({ storage: storage });

router.get("/img/cover/:name", (req, res) => {
  const name = req.params.name;

  const filePath = `./img/cover/${name}`;
  if (fs.existsSync(filePath)) {
    res.sendFile(path.resolve(filePath));
  } else {
    res.sendFile(path.resolve("./img/nofound.jpg"));
  }
});

router.post("/img/cover", upload.array("image"), (req, res) => {
  const files = req.files;

  if (!files) {
    const error = new Error("Please choose files");
    error.httpStatusCode = 400;
    return next(error);
  }

  res.status(200).json({ message: "File uploaded successfully", data: files });
});

router.get("/img/cover", (req, res) => {
  const files = fs.readdirSync("./img/cover");
  const coverFiles = files.map((file) => {
    return `${process.env.HOST}/files/img/cover/${file}`;
  });

  res.status(200).json(coverFiles);
});

router.delete("/img/cover", (req, res) => {
  const { name } = req.body;

  //detect array or not
  if (Array.isArray(name)) {
    name.forEach((file) => {
      const filePath = `./img/cover/${file}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        return res.status(404).json({ error: "File not found" });
      }
    });
  } else {
    const filePath = `./img/cover/${name}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      return res.status(404).json({ error: "File not found" });
    }
  }

  res.status(200).json({ message: "File deleted successfully" });
});

module.exports = router;
