const express = require('express');
const router = express.Router();
const validatePassword = require('../middleware/validatePassword')

const connectionCtrl = require('../controller/connection.controller');

//CREATE : créer un nouvel utilisateur
router.post('/signup', validatePassword, connectionCtrl.signup);

//READ : permettre la connexion d'un utilisateur créé en renvoyant le token d'authentification 
router.post('/login', connectionCtrl.login);

module.exports = router;