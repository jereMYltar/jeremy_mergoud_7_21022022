const express = require('express');
const router = express.Router();
const MessageCtrl = require('../controller/message.controller');
//test pour savoir si l'utilisateur a le droit d'action sur le message
const isMessageOwner = require("../policies/isMessageOwner");
//test pour savoir si l'utilisateur a le droit de publier un message dans la conversation
const isConversationMemberOrAdmin = require("../policies/isConversationMemberOrAdmin");
//test pour savoir si l'utilisateur a le droit d'action sur la conversation
const isConversationOwnerOrAdmin = require("../policies/isConversationOwnerOrAdmin");
//test pour savoir si la conversation est ouverte
const isConversationOpen = require("../policies/isConversationOpen");

//CREATE : créer un message dans une conversation et renvoi le message enregistré en base
router.post("/conversation/:conversationId", isConversationMemberOrAdmin, isConversationOpen,  MessageCtrl.createOne);

//READ : récupérer un message par son id
// router.get("/:messageId", isMessageOwner, MessageCtrl.findOne);

//READ : récupérer tous les messages d'une conversation
router.get("/conversation/:conversationId", isConversationMemberOrAdmin, MessageCtrl.readAllByConversationId);

//UPDATE : mettre à jour un message
router.put("/:messageId", isMessageOwner, MessageCtrl.updateOne);

//UPDATE : modérer un message
router.put("/:messageId/:conversationId", isConversationOwnerOrAdmin, MessageCtrl.updateOne);

//DELETE : supprimer un message
router.delete("/:messageId", isMessageOwner, MessageCtrl.deleteOne);

module.exports = router;