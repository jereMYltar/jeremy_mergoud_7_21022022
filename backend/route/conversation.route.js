const express = require('express');
const router = express.Router();
const ConversationCtrl = require('../controller/conversation.controller');
//test pour savoir si l'utilisateur a le droit d'action sur la conversation
const isConversationOwnerOrAdmin = require("../policies/isConversationOwnerOrAdmin");
//test pour savoir si l'utilisateur a le droit d'action sur la conversation en tant qu'admin
const isAdmin = require("../policies/isAdmin");
//test pour savoir si l'utilisateur a le droit de créer une conversation publique
const canCreateOrUpdateConversation = require("../policies/canCreateOrUpdateConversation");

//CREATE : créer une conversation
// router.post('/', canCreatePublicConversation, ConversationCtrl.createOne);
router.post('/new', canCreateOrUpdateConversation, ConversationCtrl.upsertOne);

//READ : récupérer toutes les conversations auxquel l'utilisateur a accès
router.get('/', ConversationCtrl.findAllAllowed);

//READ : récupérer le détail complet d'une conversation
router.get('/details/:conversationId', ConversationCtrl.findDetails);

//UPDATE : mettre à jour une conversation
// router.put('/:conversationId', isConversationOwnerOrAdmin, ConversationCtrl.updateOne);
// router.put('/timestamp/:conversationId', ConversationCtrl.updateTimestamp);

//DELETE : supprimer une conversation
router.delete('/:conversationId', isConversationOwnerOrAdmin, ConversationCtrl.deleteOne);

module.exports = router;