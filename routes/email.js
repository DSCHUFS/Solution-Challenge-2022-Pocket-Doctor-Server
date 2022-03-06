const express = require('express');
const router = express.Router();
const email = require('../controllers/email');

router.post('/', email.sendEmail);

module.exports = router;
