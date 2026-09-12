const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/authcontroller');
const { requireAuth } = require('../middleware/auth');

router.post('/daftar', authcontroller.daftar);

router.post('/masuk', authcontroller.masuk);
router.post('/lupa-password', authcontroller.lupaPassword);
router.get('/profil', requireAuth, authcontroller.getProfile);
router.put('/profil', requireAuth, authcontroller.updateProfile);

module.exports = router;