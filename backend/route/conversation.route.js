const express = require('express');
const router = express.Router();
const Conversation = require('../controller/conversation.controller');
//test pour savoir si l'utilisateur a le droit d'action sur la conversation
const isConversationOwnerOrAdmin = require("./middleware/isConversationOwnerOrAdmin");

//CREATE : créer une conversation
router.post('/', Conversation.createOne)

//READ : récupérer toutes les conversations
router.get('/', Conversation.findAll);

//READ : récupérer toutes les conversations auxquelles participe un utilisateur
router.get('/user', Conversation.findAllByUserId);

//READ : récupérer toutes les conversations génériques (auxquelles ne sont inscrits aucun utilisateur)
router.get('/generic', Conversation.findGenericConv);

//UPDATE : mettre à jour une conversation
router.put('/:id', isConversationOwnerOrAdmin, Conversation.updateOne);

//DELETE : supprimer une Conversation
router.delete('/:id', isConversationOwnerOrAdmin, Conversation.deleteOne);

module.exports = router;