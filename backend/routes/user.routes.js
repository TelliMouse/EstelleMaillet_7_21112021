const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id', auth, userCtrl.getUserById)
router.post('/email', userCtrl.isTheEmailUnique)
router.post('/password', auth, userCtrl.isThePasswordValid)
router.delete('/:id', auth, userCtrl.deleteUser)

module.exports = router;