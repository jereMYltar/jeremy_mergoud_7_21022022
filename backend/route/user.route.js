const express = require('express');
const router = express.Router();
const users = require('../controller/user.controller.js');

//CREATE : créer un utilisateur
router.post('/', users.createOne);

// READ : récupérer tous les utilisateurs
router.get('/all', users.findAllUsers);

//READ : récupérer un utilisateur en fonction de son id
router.get('/find/:id', users.findOneById);

//READ : récupérer un utilisateur en fonction de son email
router.get('/findEmail', users.findOneByEmail);

//UPDATE : mettre à jour un utilisateur
router.put('/:id', users.updateOne);

//DELETE : supprimer un utilisateur
router.delete('/:id', users.deleteOne);

module.exports = router;