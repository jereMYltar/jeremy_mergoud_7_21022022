const express = require('express');
const router = express.Router();
const Conversation = require('../controller/conversation.controller');
//test pour savoir si l'utilisateur a le droit d'action sur la conversation
const isConversationOwnerOrAdmin = require("../policies/isConversationOwnerOrAdmin");
//test pour savoir si l'utilisateur a le droit d'action sur la conversation en tant qu'admin
const isAdmin = require("../policies/isAdmin");
//test pour savoir si l'utilisateur a le droit de créer une conversation publique
const canCreatePublicConversation = require("../policies/canCreatePublicConversation");

//CREATE : créer une conversation
router.post('/', canCreatePublicConversation, Conversation.createOne);

//READ : récupérer toutes les conversations auxquel l'utilisateur a accès
router.get('/', Conversation.findAllAllowed);

//UPDATE : mettre à jour une conversation
router.put('/:conversationId', isConversationOwnerOrAdmin, Conversation.updateOne);

//UPDATE : clôturer une conversation
router.put('/close/:conversationId', isConversationOwnerOrAdmin, Conversation.closeOne);

//UPDATE : rouvrir une conversation
router.put('/reopen/:conversationId', isConversationOwnerOrAdmin, Conversation.reopenOne);

//DELETE : supprimer une Conversation
router.delete('/:conversationId', isConversationOwnerOrAdmin, Conversation.deleteOne);

module.exports = router;