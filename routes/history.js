const express = require('express');
const router = express.Router();
const history = require('../controllers/history')
const { checkToken } = require('../middlewares/auth')

router.get('/', checkToken, history.getReservation)

module.exports = router;