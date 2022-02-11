const express = require('express');
const router = express.Router();
const user = require('../controllers/user')
const { checkToken } = require('../middlewares/auth')

router.get('/ping', user.ping) // 핑
router.post('/signup', user.createUser)
router.post('/signin', user.loginUser)
router.get('/', checkToken, user.getUser)
router.put('/', checkToken, user.editUser)

module.exports = router;
