const express = require('express');
const router = express.Router();
const UserConversation = require('../model/user_conversation.model');
//test pour savoir si l'utilisateur a le droit d'action sur la conversation
const isConversationOwnerOrAdmin = require("../policies/isConversationOwnerOrAdmin");

//READ : récupérer tous les membres d'une conversation
router.get('/:conversationId', isConversationOwnerOrAdmin, UserConversation.findAllMembersByConversationId);

module.exports = router;
