const express = require('express');
const router = express.Router();
const User = require('../controller/user.controller.js');
//test pour savoir si l'utilisateur a le droit d'action sur le compte
const isAccountOwnerOrAdmin = require("../middleware/isAccountOwnerOrAdmin");
const isConnected = require("../middleware/isConnected");

//CREATE : créer un utilisateur
router.post('/', User.createOne);

// READ : récupérer un utilisateur spécifique
router.get('/', isConnected, User.findOneByToken);

// READ : récupérer tous les utilisateurs
router.get('/other', isConnected, User.findAllOtherUsers);

// READ : récupérer tous les utilisateurs
router.get('/all', User.findAllUsers);

//READ : récupérer un utilisateur en fonction de son id
router.get('/find/:userId', User.findOneById);

//READ : récupérer une quantité d'information limité d'un utilisateur en fonction de son id
router.get('/findLimited/:userId', User.findOneLimitedById);

//READ : récupérer un utilisateur en fonction de son email
router.get('/findEmail', User.findOneByEmail);

//UPDATE : mettre à jour un utilisateur
router.put('/:userId', isAccountOwnerOrAdmin, User.updateOne);

//DELETE : supprimer un utilisateur
router.delete('/:userId', isAccountOwnerOrAdmin, User.deleteOne);

module.exports = router;