const db = require('../config/db');

// untuk mencatat transaksi baru (pemasukan/pengeluaran) ke database asli
const catatTransaksi = async(req, res) => {
    const { jenis_transaksi, kategori, jumlah, keterangan, tanggal } = req.body;

    //validasi input
    if (!jenis_transaksi || !kategori || !Number.isFinite(Number(jumlah)) || Number(jumlah) <= 0) {
        return res.status(400).json({ error: "jenis, kategori, dan jumlah transaksi wajib diisi"});
    }

    try {
        const tanggalTransaksi = tanggal || new Date().toISOString().split('T')[0];

        const queryInput = `
            INSERT INTO transaksi (user_id, jenis_transaksi, kategori, jumlah, keterangan, tanggal)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_transaksi
            `;

        const result = await db.query(queryInput, [req.user.id_user, jenis_transaksi, kategori, jumlah, keterangan, tanggalTransaksi]);
        
        return res.status(201).json({
            pesan: "Transaksi berhasil dicatat",
            data: {
                id_transaksi: result.rows[0].id_transaksi,
                jenis_transaksi,
                kategori,
                jumlah,
                keterangan,
                tanggal: tanggalTransaksi
        }
    });
    } catch (error) {
        console.error("Error database:", error.message);
        res.status(500).json({ error: "gagal menyimpan data ke database "});
    }
};

const ubahTransaksi = async (req, res) => {
    const { jenis_transaksi, kategori, jumlah, keterangan, tanggal } = req.body;

    if (!jenis_transaksi || !kategori || !Number.isFinite(Number(jumlah)) || Number(jumlah) <= 0 || !tanggal) {
        return res.status(400).json({ error: "jenis, kategori, jumlah, dan tanggal transaksi wajib diisi" });
    }

    try {
        const result = await db.query(
            `UPDATE transaksi
             SET jenis_transaksi = $1, kategori = $2, jumlah = $3, keterangan = $4, tanggal = $5
             WHERE id_transaksi = $6 AND user_id = $7
             RETURNING *`,
            [jenis_transaksi, kategori, jumlah, keterangan, tanggal, req.params.id, req.user.id_user]
        );
        if (!result.rowCount) return res.status(404).json({ error: "Transaksi tidak ditemukan" });
        return res.json({ pesan: "Transaksi berhasil diperbarui", data: result.rows[0] });
    } catch (error) {
        console.error("Error database:", error.message);
        return res.status(500).json({ error: "Gagal memperbarui transaksi" });
    }
};

const hapusTransaksi = async (req, res) => {
    try {
        const result = await db.query("DELETE FROM transaksi WHERE id_transaksi = $1 AND user_id = $2", [req.params.id, req.user.id_user]);
        if (!result.rowCount) return res.status(404).json({ error: "Transaksi tidak ditemukan" });
        return res.json({ pesan: "Transaksi berhasil dihapus" });
    } catch (error) {
        console.error("Error database:", error.message);
        return res.status(500).json({ error: "Gagal menghapus transaksi" });
    }
};

//fungsi mengambil data historis dari database asli
const ambilSemuaTransaksi = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM transaksi WHERE user_id = $1 ORDER BY tanggal DESC", [req.user.id_user]);
        const daftartransaksi = result.rows;

        return res.json({
            pesan: "Berhasil mengambil riwayat transaksi dari database",
            total_data: daftartransaksi.length,
            data: daftartransaksi
        });   
    } catch (error) {
        console.error("Error database:", error.message);
        return res.status(500).json({ error: "Gagal mengambil data dari database"});
    }
};   

// halaman stok barang
const ambilStokBarang = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                id_produk,
                nama_produk,
                sisa_stok,
                harga_beli,
                harga_jual,
                ROUND(((harga_jual - harga_beli) / harga_beli) * 100) AS margin_persen 
            FROM produk
            WHERE user_id = $1
        `, [req.user.id_user]);
        const daftarProduk = result.rows;

        return res.json({
            pesan: "Berhasil mengambil daftar stok produk dari database",
            total_produk: daftarProduk.length,
            data: daftarProduk
        });
    } catch (error) {
        console.error("Error database stok:", error.message);
        return res.status(500).json({ error: "Gagal mengambil data stok barang dari database"});
    } 
};

const tambahProduk = async (req, res) => {
    const { nama_produk, sisa_stok, harga_beli, harga_jual } = req.body;

    if (!nama_produk || !Number.isInteger(Number(sisa_stok)) || Number(sisa_stok) < 0 || !Number.isFinite(Number(harga_beli)) || Number(harga_beli) <= 0 || !Number.isFinite(Number(harga_jual)) || Number(harga_jual) <= 0) {
        return res.status(400).json({ error: "Nama, stok, harga beli, dan harga jual wajib diisi" });
    }

    try {
        const result = await db.query(
            `INSERT INTO produk (user_id, nama_produk, sisa_stok, harga_beli, harga_jual)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [req.user.id_user, nama_produk, sisa_stok, harga_beli, harga_jual]
        );
        return res.status(201).json({ pesan: "Produk berhasil ditambahkan", data: result.rows[0] });
    } catch (error) {
        console.error("Error database produk:", error.message);
        return res.status(500).json({ error: "Gagal menyimpan produk ke database" });
    }
};

const ubahProduk = async (req, res) => {
    const { nama_produk, sisa_stok, harga_beli, harga_jual } = req.body;

    if (!nama_produk || !Number.isInteger(Number(sisa_stok)) || Number(sisa_stok) < 0 || !Number.isFinite(Number(harga_beli)) || Number(harga_beli) <= 0 || !Number.isFinite(Number(harga_jual)) || Number(harga_jual) <= 0) {
        return res.status(400).json({ error: "Nama, stok, harga beli, dan harga jual wajib diisi" });
    }

    try {
        const result = await db.query(
            `UPDATE produk
             SET nama_produk = $1, sisa_stok = $2, harga_beli = $3, harga_jual = $4
             WHERE id_produk = $5 AND user_id = $6
             RETURNING *`,
            [nama_produk, sisa_stok, harga_beli, harga_jual, req.params.id, req.user.id_user]
        );
        if (!result.rowCount) return res.status(404).json({ error: "Produk tidak ditemukan" });
        return res.json({ pesan: "Produk berhasil diperbarui", data: result.rows[0] });
    } catch (error) {
        console.error("Error database produk:", error.message);
        return res.status(500).json({ error: "Gagal memperbarui produk" });
    }
};

const hapusProduk = async (req, res) => {
    try {
        const result = await db.query("DELETE FROM produk WHERE id_produk = $1 AND user_id = $2", [req.params.id, req.user.id_user]);
        if (!result.rowCount) return res.status(404).json({ error: "Produk tidak ditemukan" });
        return res.json({ pesan: "Produk berhasil dihapus" });
    } catch (error) {
        console.error("Error database produk:", error.message);
        return res.status(500).json({ error: "Gagal menghapus produk" });
    }
};

module.exports = {
    catatTransaksi,
    ubahTransaksi,
    hapusTransaksi,
    ambilSemuaTransaksi,
    ambilStokBarang,
    tambahProduk,
    ubahProduk,
    hapusProduk
};