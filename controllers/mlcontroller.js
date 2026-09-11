const axios = require('axios');
const db = require('../config/db');
const ML_SERVICE_URL = (process.env.ML_SERVICE_URL || 'https://cuanku-ml1.vercel.app').replace(/\/$/, '');

const getPredictionTrend = async (req, res) => {
    const { n_hari } = req.body;
    const days = Number(n_hari || 7);

    if (!Number.isInteger(days) || days < 1 || days > 90) {
        return res.status(400).json({
            status: 'error',
            message: 'Jumlah hari prediksi harus antara 1 sampai 90 hari.'
        });
    }

    try {
        const userId = req.user.id_user;
        
        // Ambil riwayat pendapatan per hari
        const query = `
            SELECT tanggal as ds, SUM(jumlah) as y
            FROM transaksi
            WHERE user_id = $1 AND jenis_transaksi = 'Pemasukan'
            GROUP BY tanggal
            ORDER BY tanggal ASC
        `;
        const { rows } = await db.query(query, [userId]);

        // Jika data kurang dari 3 hari, berikan fallback
        if (rows.length < 3) {
            return res.status(200).json({
                status: 'success',
                source: 'backend_fallback',
                message: 'Data transaksi tidak cukup untuk melakukan prediksi. Minimal butuh 3 hari data pemasukan.',
                result: { data: [] }
            });
        }

        // Format tanggal (karena node-postgres mengembalikan Date object)
        const history = rows.map(r => {
            const dateStr = r.ds instanceof Date ? r.ds.toISOString().split('T')[0] : r.ds;
            return {
                ds: dateStr,
                y: Number(r.y)
            };
        });

        const response = await axios.post(
            `${ML_SERVICE_URL}/api/ml/predict-trend`,
            { n_hari: days, history },
            { timeout: 15000 }
        );

        return res.status(200).json({
            status: 'success',
            source: 'ml_service',
            result: response.data
        });

    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
            return res.status(503).json({
                status: 'error',
                message: `ML Service tidak dapat dihubungi di ${ML_SERVICE_URL}. Jalankan service lokal atau periksa ML_SERVICE_URL.`
            });
        }

        if (error.response) {
            return res.status(error.response.status).json({
                status: 'error',
                message: error.response.data?.detail || error.response.data?.message || `ML Service mengembalikan HTTP ${error.response.status}.`
            });
        }
        console.error('Error on ML prediction:', error.message);
        return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server.'});
    }    
};

module.exports = { getPredictionTrend };