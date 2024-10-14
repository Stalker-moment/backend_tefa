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

const ordersRequest = require("./controllers/internal/order/request");
const ordersAccumulation = require("./controllers/internal/order/accumulation");

// Load Functions
const sendData = require("./functions/sendData");

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

//handler if route not found
app.use((req, res) => {
  res.status(404).send({ error: "Not found" });
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

// Setup WebSocket connections
wss.on("connection", async (ws, req) => {
  console.log(`WebSocket client connected from ${req.url}`);
  
  // Extract token from URL query (e.g., ws://localhost:8080/data?token=<JWT>)
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get("token");

  if (!token) {
    ws.send(JSON.stringify({ error: "Token is required" }));
    ws.close();
    return;
  }

  // Verify the token
  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    // Optionally, you can check the decoded token's content (e.g., roles, permissions, etc.)
    console.log("Token is valid, decoded:", decoded);

  } catch (err) {
    ws.send(JSON.stringify({ error: "Invalid or expired token" }));
    ws.close();
    return;
  }

  // Check for valid request endpoint
  const requestArray = ["/data"];
  if (!requestArray.some((endpoint) => req.url.startsWith(endpoint))) {
    ws.send(JSON.stringify({ error: "Invalid request URL" }));
    ws.close();
    return;
  }

  if (req.url.startsWith("/data")) {
    const dateParam = url.searchParams.get("date");
    let filterDate = null;

    // Validate and parse the date
    if (dateParam) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(dateParam)) {
        const [year, month, day] = dateParam.split("-").map(Number);
        filterDate = new Date(year, month - 1, day);
      } else {
        ws.send(
          JSON.stringify({ error: "Invalid date format. Use YYYY-MM-DD." })
        );
        ws.close();
        return;
      }
    } else {
      const today = new Date();
      filterDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
    }

    // Send the initial data
    let data = await sendData(filterDate);
    data = JSON.stringify(data);
    ws.send(data);

    // Send the data if there is a new log entry
    const intervalId = setInterval(async () => {
      let newData = await sendData(filterDate);

      if (JSON.stringify(newData) !== data) {
        data = JSON.stringify(newData);
        ws.send(data);
      }
    }, 1000);

    ws.on("close", () => {
      console.log("WebSocket client disconnected from /data");
      clearInterval(intervalId);
    });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});
