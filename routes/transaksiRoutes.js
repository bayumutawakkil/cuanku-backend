const express = require('express');
const router = express.Router();
const transaksicontroller = require('../controllers/transaksicontroller');

//URL untuk membuat transaksi baru
router.post('/', transaksicontroller.catatTransaksi);

// URL untuk mengambil semua riwayat transaksi
router.get('/', transaksicontroller.ambilSemuaTransaksi);
router.put('/:id', transaksicontroller.ubahTransaksi);
router.delete('/:id', transaksicontroller.hapusTransaksi);

// URL untuk mengambil daftar stok produk
router.get('/stok', transaksicontroller.ambilStokBarang);
router.post('/stok', transaksicontroller.tambahProduk);
router.put('/stok/:id', transaksicontroller.ubahProduk);
router.delete('/stok/:id', transaksicontroller.hapusProduk);

module.exports = router;