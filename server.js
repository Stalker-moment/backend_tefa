const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const WebSocket = require("ws"); // Import the ws package
const http = require("http"); // Import the http package
const { verify } = require("jsonwebtoken");

dotenv.config();

const app = express();

// Load controllers
const usersLogin = require("./controllers/users/login");
const usersRegister = require("./controllers/users/register");
const userEdit = require("./controllers/users/edit");
const userAccount = require("./controllers/users/account");

const internalManageRack = require("./controllers/internal/manage/rack");
const internalManageItems = require("./controllers/internal/manage/items");
const internalCategory = require("./controllers/internal/manage/category");

const internalData = require("./controllers/internal/data");

const filesAssets = require("./controllers/files/assets");
const filesProfile = require("./controllers/files/profile");
const filesItems = require("./controllers/files/items");
const filesCover = require("./controllers/files/cover");

const ordersRequest = require("./controllers/internal/order/request");
const ordersAccumulation = require("./controllers/internal/order/accumulation");

// Load WebSocket handlers
const handleDataItemsSocket = require("./sockets/dataItems");
const handleDataRackSocket = require("./sockets/dataRack");
const handleDataCategorySocket = require("./sockets/dataCategory");
const handleDataAccountsSocket = require("./sockets/dataAccounts");

// Load Functions
const sendDataItems = require("./functions/sendDataItems");

//-----------------Configuration------------------//
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.enable("trust proxy");
app.set("view engine", "ejs");

const PORT = process.env.PORT || 1777;

//-----------------Routes------------------//

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API", status: 200 });
});

//===============[User Routes]=================//
app.use("/api/users", usersLogin);
app.use("/api/users", usersRegister);
app.use("/api/users", userEdit);
app.use("/api/users", userAccount);

//===============[Internal Routes]=================//
app.use("/api/internal/manage", internalManageRack);
app.use("/api/internal/manage", internalManageItems);
app.use("/api/internal/manage", internalCategory);

app.use("/api/internal/data", internalData);

//===============[Order Routes]=================//
app.use("/api/internal/order", ordersRequest);
app.use("/api/internal/order", ordersAccumulation);

//===============[File Routes]=================//
app.use("/files", filesAssets);
app.use("/files", filesProfile);
app.use("/files", filesItems);
app.use("/files", filesCover);

//handler if route not found
app.use((req, res) => {
  res.status(404).send({ error: "Not found" });
});

// Setup WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Setup WebSocket connections
wss.on("connection", (ws, req) => {
  if (req.url.startsWith("/data-items")) {
    handleDataItemsSocket(ws, req);
  } else if (req.url.startsWith("/data-rack")) {
    handleDataRackSocket(ws, req);
  } else if (req.url.startsWith("/data-category")) {
    handleDataCategorySocket(ws, req);
  } else if (req.url.startsWith("/accounts")) {
    handleDataAccountsSocket(ws, req);
  } else {
    ws.send(JSON.stringify({ error: "Invalid request URL" }));
    ws.close();
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});