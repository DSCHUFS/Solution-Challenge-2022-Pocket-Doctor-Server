const express = require('express');
const router = express.Router();
const home = require('../controllers/home')
const { checkToken } = require('../middlewares/auth')

router.get('/doctor', checkToken, home.getDoctor)
router.get('/hospital', checkToken, home.getHospital)
// router.post('/reservation', checkToken, home.createReservation)

module.exports = router;
