const express = require('express');
const router = express.Router();
const User = require('../controller/user.controller.js');
//test pour savoir si l'utilisateur a le droit d'action sur le compte
const isAccountOwnerOrAdmin = require("./middleware/isAccountOwnerOrAdmin");

//CREATE : créer un utilisateur
router.post('/', User.createOne);

// READ : récupérer tous les utilisateurs
router.get('/all', User.findAllUsers);

//READ : récupérer un utilisateur en fonction de son id
router.get('/find/:id', User.findOneById);

//READ : récupérer une quantité d'information limité d'un utilisateur en fonction de son id
router.get('/findLimited/:id', User.findOneLimitedById);

//READ : récupérer un utilisateur en fonction de son email
router.get('/findEmail', User.findOneByEmail);

//UPDATE : mettre à jour un utilisateur
router.put('/:id', isAccountOwnerOrAdmin, User.updateOne);

//DELETE : supprimer un utilisateur
router.delete('/:id', isAccountOwnerOrAdmin, User.deleteOne);

module.exports = router;