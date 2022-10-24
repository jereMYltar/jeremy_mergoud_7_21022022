const express = require('express');
const router = express.Router();
const Conversation = require('../controller/conversation.controller');
const isConversationAdmin = require('../middleware/isConversationAdmin');

//CREATE : créer une conversation
router.post('/', Conversation.createOne)

//READ : récupérer toutes les conversations
router.get('/', Conversation.findAll);

//READ : récupérer toutes les conversations auxquelles participe un utilisateur
router.get('/user', Conversation.findAllByUserId);

//READ : récupérer toutes les conversations génériques (auxquelles ne sont inscrits aucun utilisateur)
router.get('/generic', Conversation.findGenericConv);

//UPDATE : mettre à jour une conversation
router.put('/:id', isConversationAdmin, Conversation.updateOne);

//DELETE : supprimer une Conversation
router.delete('/:id', isConversationAdmin, Conversation.deleteOne);

module.exports = router;