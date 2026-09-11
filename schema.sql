-- schema.sql
--
-- Jalankan file ini secara manual di Supabase SQL Editor.
-- Untuk database lama, isi user_id pada produk/transaksi terlebih dahulu
-- sebelum menjalankan ALTER COLUMN ... SET NOT NULL di bagian bawah.

CREATE TABLE IF NOT EXISTS users (
    id_user      SERIAL PRIMARY KEY,
    nama_UMKM    VARCHAR(100) NOT NULL,
    email        VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100),
    username     VARCHAR(100),
    nomor_telepon VARCHAR(30),
    kategori_usaha VARCHAR(100),
    alamat       VARCHAR(255),
    dibuat_pada  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS nama_lengkap VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS nomor_telepon VARCHAR(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS kategori_usaha VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS alamat VARCHAR(255);

CREATE TABLE IF NOT EXISTS produk (
    id_produk    SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    nama_produk  VARCHAR(100) NOT NULL,
    sisa_stok    INT NOT NULL DEFAULT 0 CHECK (sisa_stok >= 0),
    harga_beli   DECIMAL(12, 2) NOT NULL CHECK (harga_beli > 0),
    harga_jual   DECIMAL(12, 2) NOT NULL CHECK (harga_jual > 0),
    dibuat_pada  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transaksi (
    id_transaksi     SERIAL PRIMARY KEY,
    user_id          INTEGER NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    jenis_transaksi  VARCHAR(20) CHECK (jenis_transaksi IN ('Pemasukan', 'Pengeluaran')) NOT NULL,
    kategori         VARCHAR(50) NOT NULL,
    jumlah           DECIMAL(12, 2) NOT NULL CHECK (jumlah > 0),
    keterangan       VARCHAR(255),
    tanggal          DATE NOT NULL,
    dibuat_pada      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compatibility columns for databases created before user ownership was added.
-- Existing rows remain NULL until they are assigned to the correct user manually.
ALTER TABLE produk ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id_user) ON DELETE CASCADE;
ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id_user) ON DELETE CASCADE;

CREATE INDEX idx_transaksi_tanggal ON transaksi (tanggal);
CREATE INDEX idx_transaksi_kategori ON transaksi (kategori);
CREATE INDEX idx_produk_user ON produk (user_id);
CREATE INDEX idx_transaksi_user ON transaksi (user_id);

-- Manual migration for an existing database:
-- ALTER TABLE produk ADD COLUMN IF NOT EXISTS user_id INTEGER;
-- ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS user_id INTEGER;
-- UPDATE produk SET user_id = (SELECT id_user FROM users ORDER BY id_user LIMIT 1) WHERE user_id IS NULL;
-- UPDATE transaksi SET user_id = (SELECT id_user FROM users ORDER BY id_user LIMIT 1) WHERE user_id IS NULL;
-- ALTER TABLE produk ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE transaksi ALTER COLUMN user_id SET NOT NULL;
-- ALTER TABLE produk ADD CONSTRAINT produk_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE;
-- ALTER TABLE transaksi ADD CONSTRAINT transaksi_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE;
