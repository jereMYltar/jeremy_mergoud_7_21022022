const express = require('express');
const router = express.Router();
const Conversation = require('../controller/conversation.controller');

//CREATE : créer une conversation
router.post('/', Conversation.createOne)

//READ : récupérer toutes les conversations
router.get('/', Conversation.findAll);

//READ : récupérer toutes les conversations auxquelles participe un utilisateur
router.get('/user', Conversation.findAllByUserId);

//UPDATE : mettre à jour une conversation
router.put('/:id', Conversation.updateOne);

//DELETE : supprimer une Conversation
router.delete('/:id', Conversation.deleteOne);

module.exports = router;