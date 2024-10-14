const express = require('express');
const device = require('express-device');
const jwt = require('jsonwebtoken');
const app = express();

app.use(device.capture());

app.get('/generate-token', (req, res) => {
  const deviceType = req.device.type;
  const deviceName = req.device.name || 'unknown';
  const userAgent = req.headers['user-agent'];  // Mendapatkan user-agent

  // Kombinasikan semua informasi ke dalam fingerprint
  const fingerprint = `${deviceType}-${userAgent}`;
  console.log(fingerprint)

  // Generate token dengan fingerprint yang lebih unik
  const token = jwt.sign({ fingerprint }, 'your-secret-key', { expiresIn: '1h' });
  res.json({ token, fingerprint });
});

app.get('/verify-token', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const deviceType = req.device.type;
  const deviceName = req.device.name || 'unknown';
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.ip;

  const fingerprint = `${deviceType}-${userAgent}`;
  console.log(fingerprint)

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    
    // Cek apakah fingerprint yang disimpan dalam token cocok dengan fingerprint saat ini
    if (decoded.fingerprint !== fingerprint) {
      return res.status(401).json({ error: 'Invalid device' });
    }
    
    res.json({ message: 'Token valid' });
  } catch (err) {
    res.status(401).json({ error: 'Token verification failed' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
