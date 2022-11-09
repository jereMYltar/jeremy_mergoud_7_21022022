const express = require('express');
const router = express.Router();
const Conversation = require('../controller/conversation.controller');
//test pour savoir si l'utilisateur a le droit d'action sur la conversation
const isConversationOwnerOrAdmin = require("../middleware/isConversationOwnerOrAdmin");
//test pour savoir si l'utilisateur a le droit d'action sur la conversation en tant qu'admin
const isAdmin = require("../middleware/isAdmin");

//CREATE : créer une conversation
router.post('/', Conversation.createOne);

//READ : récupérer toutes les conversations
router.get('/', isAdmin, Conversation.findAll);

//READ : récupérer toutes les conversations auxquelles participe un utilisateur
router.get('/user', Conversation.findAllByUserId);

//READ : récupérer toutes les conversations génériques (auxquelles ne sont inscrits aucun utilisateur)
router.get('/generic', Conversation.findGenericConv);

//UPDATE : mettre à jour une conversation
router.put('/:id', isConversationOwnerOrAdmin, Conversation.updateOne);

//UPDATE : clôturer une conversation
router.put('/close/:id', isConversationOwnerOrAdmin, Conversation.closeOne);

//UPDATE : rouvrir une conversation
router.put('/reopen/:id', isConversationOwnerOrAdmin, Conversation.reopenOne);

//DELETE : supprimer une Conversation
router.delete('/:id', isConversationOwnerOrAdmin, Conversation.deleteOne);

module.exports = router;