var XLSXChart = require("xlsx-chart");

// Fungsi untuk menghasilkan data dummy
function generateDummyData() {
    const data = {
        "Title 1": {
            "Field 1": Math.floor(Math.random() * 100),
            "Field 2": Math.floor(Math.random() * 100),
            "Field 3": Math.floor(Math.random() * 100),
            "Field 4": Math.floor(Math.random() * 100),
        },
        "Title 2": {
            "Field 1": Math.floor(Math.random() * 100),
            "Field 2": Math.floor(Math.random() * 100),
            "Field 3": Math.floor(Math.random() * 100),
            "Field 4": Math.floor(Math.random() * 100),
        },
        "Title 3": {
            "Field 1": Math.floor(Math.random() * 100),
            "Field 2": Math.floor(Math.random() * 100),
            "Field 3": Math.floor(Math.random() * 100),
            "Field 4": Math.floor(Math.random() * 100),
        },
    };
    return data;
}

// Data yang akan digunakan
const data = generateDummyData();

var xlsxChart = new XLSXChart();
var opts = {
    file: "chart_with_table.xlsx",
    chart: "column", // Jenis grafik
    titles: [
        "Title 1",
        "Title 2",
        "Title 3"
    ],
    fields: [
        "Field 1",
        "Field 2",
        "Field 3",
        "Field 4"
    ],
    data: data // Data dummy yang dihasilkan
};

// Menyimpan file Excel dengan grafik
xlsxChart.writeFile(opts, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("File created: ", opts.file);

        // Menambahkan data tabel di bawah grafik
        const XLSX = require('xlsx');

        // Membaca file yang sudah dibuat
        const workbook = XLSX.readFile(opts.file);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Menambahkan tabel data di bawah grafik
        const startRow = 10; // Baris di mana tabel data akan dimulai
        const headers = ["Title", "Field 1", "Field 2", "Field 3", "Field 4"];
        
        // Menambahkan header tabel
        for (let col = 0; col < headers.length; col++) {
            const cell = String.fromCharCode(65 + col) + (startRow);
            worksheet[cell] = { v: headers[col], t: 's' };
        }

        // Menambahkan data tabel
        Object.keys(data).forEach((title, rowIndex) => {
            worksheet[`A${startRow + rowIndex + 1}`] = { v: title, t: 's' }; // Title
            Object.keys(data[title]).forEach((field, colIndex) => {
                worksheet[String.fromCharCode(66 + colIndex) + (startRow + rowIndex + 1)] = { v: data[title][field], t: 'n' }; // Values
            });
        });

        // Menyimpan kembali workbook
        XLSX.writeFile(workbook, opts.file);
    }
});
