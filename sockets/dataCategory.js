const { verify } = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const sendDataCategory = require("../functions/sendDataCategory");

function handleDataCategorySocket(ws, req) {
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

    if (decoded.expired < Date.now()) {
      ws.send(JSON.stringify({ error: "Invalid or expired token" }));
      ws.close();
      return;
    }
    //console.log("Token is valid, decoded:", decoded);
  } catch (err) {
    ws.send(JSON.stringify({ error: "Invalid or expired token" }));
    ws.close();
    return;
  }

  const categoryName = url.searchParams.get("category");

  let filterCategory = null;

  if (categoryName) {
    filterCategory = categoryName;
  }

  // Send the initial data
  let data = null;

  const sendUpdatedData = async () => {
    let newData = await sendDataCategory(filterCategory);

    if (JSON.stringify(newData) !== data) {
      data = JSON.stringify(newData);
      ws.send(data);
    }
  };

  // Send the initial data immediately
  sendUpdatedData();

  // Set up an interval to send new data every second if it changes
  const intervalId = setInterval(sendUpdatedData, 1000);

  ws.on("close", () => {
    console.log("WebSocket client disconnected from /data-rack");
    clearInterval(intervalId);
  });
}

module.exports = handleDataCategorySocket;
