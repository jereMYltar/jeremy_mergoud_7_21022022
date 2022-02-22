const express = require('express');
const router = express.Router();
const users = require('../controller/user.controller.js');

// Retrieve all User
router.get('/users', users.findAll);

//ajouter ici les autres routes pour les users





module.exports = router;