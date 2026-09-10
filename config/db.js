require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // wajib untuk koneksi ke Supabase
    },
    max: Number(process.env.DB_POOL_MAX || 1),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

pool.connect()
    .then((client) => {
        console.log('Koneksi ke database BERHASIL');
        client.release();
    })
    .catch((err) => {
        console.error('Koneksi database GAGAL:', err.message);
    });

module.exports = pool;