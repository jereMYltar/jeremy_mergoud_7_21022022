const express = require('express');
const router = express.Router();
const UserConversationModel = require('../model/user_conversation.model');
const UserConversationCtrl = require('../controller/user_conversation.controller');
//test pour savoir si l'utilisateur a le droit d'action sur la conversation
const isConversationOwnerOrAdmin = require("../policies/isConversationOwnerOrAdmin");

//READ : récupérer tous les membres d'une conversation
router.get('/:conversationId', isConversationOwnerOrAdmin, UserConversationModel.findAllMembersByConversationId);

//UPDATE : mettre à jour les membres d'une conversation
router.put('/:conversationId', isConversationOwnerOrAdmin, UserConversationCtrl.updateAllMembersByConversationId);

module.exports = router;
