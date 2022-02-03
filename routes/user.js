const express = require('express');
const router = express.Router();
const user = require('../controllers/user')
const { checkToken } = require('../middlewares/auth')

router.get('/ping', user.ping) // 핑
router.post('/', user.createUser)
router.post('/login', user.loginUser)
router.get('/', checkToken, user.getUser)
router.put('/', checkToken, user.editUser)

module.exports = router;
