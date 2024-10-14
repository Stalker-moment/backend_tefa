const express = require('express');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const app = express();

const width = 800;
const height = 600;

const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

app.get('/chart', async (req, res) => {
  const configuration = {
    type: 'line',
    data: {
      labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], // Labels sumbu X
      datasets: [
        {
          label: 'Dataset 1',
          data: [3, -2, 1, 0, -3, 2, 4, -1], // Data yang memiliki nilai negatif dan positif
          borderColor: 'blue',
          borderWidth: 1,
          fill: false, // Garis tidak diisi
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false, // Tidak mulai dari 0
          min: -5,            // Batas minimum negatif pada sumbu Y
          max: 5,             // Batas maksimum pada sumbu Y
        },
        x: {
          // Membuat sumbu Y berada di tengah-tengah sumbu X
          grid: {
            zeroLineColor: 'black',
          },
        },
      },
      plugins: {
        legend: {
          display: false, // Menyembunyikan legenda
        },
      },
    },
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);

  res.set('Content-Type', 'image/png');
  res.send(image);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});