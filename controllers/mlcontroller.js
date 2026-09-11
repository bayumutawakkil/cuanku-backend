const axios = require('axios');
const ML_SERVICE_URL = (process.env.ML_SERVICE_URL || 'https://cuanku-ml-service.vercel.app').replace(/\/$/, '');

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
        const response = await axios.post(
            `${ML_SERVICE_URL}/api/ml/predict-trend`,
            { n_hari: days },
            { timeout: 5000 }
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
        return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server.'});
    }    
};

module.exports = { getPredictionTrend };