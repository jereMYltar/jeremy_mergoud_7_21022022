const express = require('express');
const router = express.Router();
const User = require('../controller/user.controller.js');

//CREATE : créer un utilisateur
router.post('/', User.createOne);

// READ : récupérer tous les utilisateurs
router.get('/all', User.findAllUsers);

//READ : récupérer un utilisateur en fonction de son id
router.get('/find/:id', User.findOneById);

//READ : récupérer une quantité d'information llimité d'un utilisateur en fonction de son id
router.get('/findLimited/:id', User.findOneLimitedById);

//READ : récupérer un utilisateur en fonction de son email
router.get('/findEmail', User.findOneByEmail);

//UPDATE : mettre à jour un utilisateur
router.put('/:id', User.updateOne);

//DELETE : supprimer un utilisateur
router.delete('/:id', User.deleteOne);

module.exports = router;