const axios = require('axios');
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'https://cuanku-ml-service.vercel.app';

const getPredictionTrend = async (req, res) => {
    const { n_hari } = req.body;


    try {
        const response = await axios.post(
            `${ML_SERVICE_URL}/api/ml/predict-trend`,
            { n_hari: n_hari || 7 },
            { timeout: 5000 }
        );

        return res.status(200).json({
            status: 'success',
            source: 'ml_service',
            result: response.data
        });

    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            return res.status(503).json({
                status: 'error',
                message: 'ML Service sedang tidak aktif. Periksa URL dan status deployment ML service.'
            });
        }

        if (error.response) {
            return res.status(error.response.status).json({
                status: 'error',
                message: error.response.data.detail || 'Gagal mengambil prediksi.'
            });
        }
        return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server.'});
    }    
};

module.exports = { getPredictionTrend };