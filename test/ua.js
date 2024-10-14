const express = require('express');
const useragent = require('express-useragent');
const app = express();

app.use(useragent.express());

app.get('/device-info', (req, res) => {
  const deviceInfo = req.useragent;
  console.log(deviceInfo);
  res.json({
    message: 'Device information',
    deviceInfo
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
