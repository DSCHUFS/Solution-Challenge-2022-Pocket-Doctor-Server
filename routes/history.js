const express = require('express');
const router = express.Router();
const history = require('../controllers/history')
const { checkToken } = require('../middlewares/auth')

router.get('/', checkToken, history.getReservation)
router.post('/medicine', checkToken, history.createMedicine)

module.exports = router;