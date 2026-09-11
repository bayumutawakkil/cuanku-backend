const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../middleware/auth');

const createToken = (user) => jwt.sign(
    { id_user: user.id_user, email: user.email },
    getJwtSecret(),
    { expiresIn: '7d' }
);

const publicUser = (user) => {
    const { password: _password, ...safeUser } = user;
    return safeUser;
};

const daftar = async (req, res) => {
    const { nama_UMKM, nama_lengkap, username, email, password } = req.body;

    if (!nama_UMKM || !email || !password) {
        return res.status(400).json({ error: "Semua data wajib diisi"});
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const query = `INSERT INTO users (nama_UMKM, nama_lengkap, username, email, password)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const result = await db.query(query, [nama_UMKM, nama_lengkap || null, username || null, email.trim().toLowerCase(), hashedPassword]);
        const user = result.rows[0];
        
        return res.status(201).json({
        pesan: "Registrasi akun UMKM berhasil disimpan ke database!",
        token: createToken(user),
        user: publicUser(user)
    });
    } catch (error) {
        console.error("Error Registrasi:", error.message);
        if (error.code === '23505') {
            return res.status(409).json({ error: "Email sudah terdaftar" });
        }
        return res.status(500).json({ error: "Gagal menyimpan akun ke database" });
    }
};


const masuk = async (req, res) => {
    const { email: identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ error: "Username/email dan password wajib diisi!"});
    }

    try {
        const query = `SELECT * FROM users
            WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($1)
            LIMIT 1`;
        const result = await db.query(query, [identifier.trim()]);
        const rows = result.rows;

        if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password))) {
            return res.status(401).json({ error: "Email atau password salah!"});
        }

        const user = rows[0];
        return res.json({
        pesan: "Login berhasil terverifikasi database!",
        token: createToken(user),
        user: publicUser(user)
    });
    } catch (error) {
        console.error("Error Login:", error.message);
        return res.status(500).json({ error: "Terjadi kesalahan pada server saat login" });
    }
};

const lupaPassword = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || password.length < 6) {
        return res.status(400).json({ error: "Email dan password baru minimal 6 karakter wajib diisi" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await db.query(
            "UPDATE users SET password = $1 WHERE email = $2 RETURNING id_user, email",
            [hashedPassword, email.trim().toLowerCase()]
        );
        if (!result.rowCount) return res.status(404).json({ error: "Email tidak ditemukan" });
        return res.json({ pesan: "Password berhasil diubah" });
    } catch (error) {
        console.error("Error reset password:", error.message);
        return res.status(500).json({ error: "Gagal mengubah password" });
    }
};

module.exports = {
    daftar,
    masuk,
    lupaPassword
};