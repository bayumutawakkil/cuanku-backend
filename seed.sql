-- seed.sql
--
-- Data awal untuk pengujian aplikasi.
-- Jalankan sekali di Supabase SQL Editor setelah schema.sql.

INSERT INTO users (nama_UMKM, nama_lengkap, username, email, password, kategori_usaha, alamat) VALUES
('Kedai Kopi Melati', 'Pemilik Kedai', 'pemilik_kedai', 'test@cuanku.com', '$2b$12$N0B0DDYhMcXRyrvB3y4lvOuaPVV8dD3WFY6Qcv1//GuXGGx0EgKHe', 'Kuliner', 'Alamat belum diatur')
ON CONFLICT (email) DO NOTHING;

INSERT INTO produk (user_id, nama_produk, sisa_stok, harga_beli, harga_jual)
SELECT u.id_user, data.nama_produk, data.sisa_stok, data.harga_beli, data.harga_jual
FROM (VALUES
	('Kopi Susu', 40, 6000, 12000),
	('Es Teh', 55, 2000, 5000),
	('Roti Bakar', 20, 5000, 10000)
) AS data(nama_produk, sisa_stok, harga_beli, harga_jual)
JOIN users u ON u.email = 'test@cuanku.com'
WHERE NOT EXISTS (
    SELECT 1 FROM produk p
    WHERE p.user_id = u.id_user AND p.nama_produk = data.nama_produk
);

INSERT INTO transaksi (user_id, jenis_transaksi, kategori, jumlah, keterangan, tanggal)
SELECT u.id_user, data.jenis_transaksi, data.kategori, data.jumlah, data.keterangan, data.tanggal
FROM (VALUES
	('Pemasukan', 'Penjualan Produk', 180000, 'Penjualan harian', '2026-09-08'::DATE),
	('Pemasukan', 'Penjualan Produk', 220000, 'Penjualan harian', '2026-09-09'::DATE),
	('Pengeluaran', 'Biaya Bahan Baku', 90000, 'Beli bahan baku kopi', '2026-09-08'::DATE),
	('Pengeluaran', 'Biaya Operasional', 50000, 'Listrik dan air', '2026-09-09'::DATE)
) AS data(jenis_transaksi, kategori, jumlah, keterangan, tanggal)
JOIN users u ON u.email = 'test@cuanku.com'
WHERE NOT EXISTS (
		SELECT 1 FROM transaksi t
		WHERE t.user_id = u.id_user
			AND t.jenis_transaksi = data.jenis_transaksi
			AND t.kategori = data.kategori
			AND t.jumlah = data.jumlah
			AND t.tanggal = data.tanggal
);
