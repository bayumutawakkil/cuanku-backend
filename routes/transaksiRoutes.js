const express = require('express');
const router = express.Router();
const transaksicontroller = require('../controllers/transaksicontroller');

//URL untuk membuat transaksi baru
router.post('/', transaksicontroller.catatTransaksi);

// URL untuk mengambil semua riwayat transaksi
router.get('/', transaksicontroller.ambilSemuaTransaksi);

// URL untuk mengambil daftar stok produk
router.get('/stok', transaksicontroller.ambilStokBarang);
router.post('/stok', transaksicontroller.tambahProduk);

module.exports = router;