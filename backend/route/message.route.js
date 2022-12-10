const express = require('express');
const router = express.Router();
const Message = require('../controller/message.controller');
//test pour savoir si l'utilisateur a le droit d'action sur le message
const isMessageOwner = require("../middleware/isMessageOwner");
//test pour savoir si l'utilisateur a le droit de publier un message dans la conversation
const isConversationMemberOrAdmin = require("../middleware/isConversationMemberOrAdmin");
//test pour savoir si l'utilisateur a le droit d'action sur la conversation
const isConversationOwnerOrAdmin = require("../middleware/isConversationOwnerOrAdmin");
//test pour savoir si la conversation est ouverte
const isOpenConversation = require("../middleware/isOpenConversation");

//CREATE : créer un message dans une conversation et renvoi le message enregistré en base
router.post("/conversation/:conversationId", isConversationMemberOrAdmin, Message.createOne);

//READ : récupérer un message par son id
router.get("/:messageId", isMessageOwner, Message.findOne);

//READ : récupérer tous les messages d'une conversation
router.get("/conversation/:conversationId", isConversationMemberOrAdmin, Message.readAllByConversationId);

//UPDATE : mettre à jour un message
router.put("/:messageId", isMessageOwner, Message.updateOne);

//UPDATE : modérer un message
router.put("/:messageId/:conversationId", isConversationOwnerOrAdmin, Message.updateOne);

//DELETE : supprimer un message
router.delete("/:messageId", isMessageOwner, Message.deleteOne);

module.exports = router;