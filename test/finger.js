const express = require("express");
const useragent = require("express-useragent");
const app = express();

app.use(useragent.express());

app.get("/get-fingerprint", (req, res) => {
    const Fingerprint2 = require('fingerprintjs2');

    Fingerprint2.getV18({}, function(components) {
      console.log('Components:', components);  // Output hash string
    
      // Jika 'components' sudah berupa hash string, gunakan langsung
      const fingerprint = components;  // Komponen sudah berupa fingerprint hash
      console.log('Fingerprint:', fingerprint);
      res.json({
        data: fingerprint
    });
    });    
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
