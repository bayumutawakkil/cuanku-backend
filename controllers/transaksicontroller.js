const db = require('../config/db');

// untuk mencatat transaksi baru (pemasukan/pengeluaran) ke database asli
const catatTransaksi = async(req, res) => {
    const { jenis_transaksi, kategori, jumlah, keterangan, tanggal } = req.body;

    //validasi input
    if (!jenis_transaksi || !kategori || !jumlah) {
        return res.status(400).json({ error: "jenis, kategori, dan jumlah transaksi wajib diisi"});
    }

    try {
        const tanggalTransaksi = tanggal || new Date().toISOString().split('T')[0];

        const queryInput = `
            INSERT INTO transaksi (jenis_transaksi, kategori, jumlah, keterangan, tanggal)
            VALUES ($1, $2, $3, $4, $5) RETURNING id_transaksi
            `;

        const result = await db.query(queryInput, [jenis_transaksi, kategori, jumlah, keterangan, tanggalTransaksi]);
        
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

//fungsi mengambil data historis dari database asli
const ambilSemuaTransaksi = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM transaksi ORDER BY tanggal DESC");
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
        `);
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

    if (!nama_produk || sisa_stok === undefined || !harga_beli || !harga_jual) {
        return res.status(400).json({ error: "Nama, stok, harga beli, dan harga jual wajib diisi" });
    }

    try {
        const result = await db.query(
            `INSERT INTO produk (nama_produk, sisa_stok, harga_beli, harga_jual)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [nama_produk, sisa_stok, harga_beli, harga_jual]
        );
        return res.status(201).json({ pesan: "Produk berhasil ditambahkan", data: result.rows[0] });
    } catch (error) {
        console.error("Error database produk:", error.message);
        return res.status(500).json({ error: "Gagal menyimpan produk ke database" });
    }
};

module.exports = {
    catatTransaksi,
    ambilSemuaTransaksi,
    ambilStokBarang,
    tambahProduk
};