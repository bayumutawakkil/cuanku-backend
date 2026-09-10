-- seed.sql
--
-- Data awal untuk pengujian aplikasi.
-- Jalankan sekali di Supabase SQL Editor setelah schema.sql.

INSERT INTO users (nama_UMKM, nama_lengkap, username, email, password, kategori_usaha, alamat) VALUES
('Kedai Kopi Melati', 'Pemilik Kedai', 'pemilik_kedai', 'test@cuanku.com', 'password123', 'Kuliner', 'Alamat belum diatur');

INSERT INTO produk (nama_produk, sisa_stok, harga_beli, harga_jual) VALUES
('Kopi Susu', 40, 6000, 12000),
('Es Teh', 55, 2000, 5000),
('Roti Bakar', 20, 5000, 10000);

INSERT INTO transaksi (jenis_transaksi, kategori, jumlah, keterangan, tanggal) VALUES
('Pemasukan', 'Penjualan Produk', 180000, 'Penjualan harian', '2026-09-08'),
('Pemasukan', 'Penjualan Produk', 220000, 'Penjualan harian', '2026-09-09'),
('Pengeluaran', 'Biaya Bahan Baku', 90000, 'Beli bahan baku kopi', '2026-09-08'),
('Pengeluaran', 'Biaya Operasional', 50000, 'Listrik dan air', '2026-09-09');
