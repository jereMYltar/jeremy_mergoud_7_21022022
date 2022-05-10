const express = require('express');
const router = express.Router();
const validatePassword = require('../middleware/validatePassword')

const connectionCtrl = require('../controller/connection.controller');

router.post('/signup', validatePassword, connectionCtrl.signup);
router.post('/login', connectionCtrl.login);

module.exports = router;