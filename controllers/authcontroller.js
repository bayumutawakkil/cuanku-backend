const db = require('../config/db');

const daftar = async (req, res) => {
    const { nama_UMKM, nama_lengkap, username, email, password } = req.body;

    if (!nama_UMKM || !email || !password) {
        return res.status(400).json({ error: "Semua data wajib diisi"});
    }

    try {
        const query = `INSERT INTO users (nama_UMKM, nama_lengkap, username, email, password)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const result = await db.query(query, [nama_UMKM, nama_lengkap || null, username || null, email, password]);
        
        return res.status(201).json({
        pesan: "Reistrasi akun UMKM berhasil disimpan ke database!",
        data: result.rows[0]
    });
    } catch (error) {
        console.error("Error Registrasi:", error.message);
        return res.status(500).json({ error: "Gagal menyimpan akun ke database" });
    }
};


const masuk = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email dan password wajib diisi!"});
    }

    try {
        const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
        const result = await db.query(query, [email, password]);
        const rows = result.rows;

        if (rows.length === 0) {
            return res.status(401).json({ error: "Email atau password salah!"});
        }

        return res.json({
        pesan: "Login berhasil terverifikasi database!",
        token: "ini_token_rahasia",
        user: rows[0]
    });
    } catch (error) {
        console.error("Error Login:", error.message);
        return res.status(500).json({ error: "Terjadi kesalahan pada server saat login" });
    }
};


module.exports = {
    daftar, 
    masuk
};