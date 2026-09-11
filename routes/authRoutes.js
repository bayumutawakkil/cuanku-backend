const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/authcontroller');

router.post('/daftar', authcontroller.daftar);

router.post('/masuk', authcontroller.masuk);
router.post('/lupa-password', authcontroller.lupaPassword);

module.exports = router;