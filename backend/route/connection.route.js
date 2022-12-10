const express = require('express');
const router = express.Router();
const validatePassword = require('../middleware/validatePassword')
const Connection = require('../controller/connection.controller');

//CREATE : créer un nouvel utilisateur
router.post('/signup', validatePassword, Connection.signup);

//READ : permettre la connexion d'un utilisateur créé en renvoyant le token d'authentification 
router.post('/login', Connection.login);

module.exports = router;