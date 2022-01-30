const express = require('express');
const router = express.Router();
const user = require('../controllers/user')
// const { checkToken } = require('../middlewares/auth')

router.get('/', user.ping) // 핑
router.post('/', user.createUser)

module.exports = router;
