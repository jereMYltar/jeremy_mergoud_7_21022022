const express = require('express');
const router = express.Router();
const Message = require('../controller/message.controller');
//test pour savoir si l'utilisateur a le droit d'action sur le message
const isMessageOwnerOrAdmin = require("../middleware/isMessageOwnerOrAdmin");
//test pour savoir si l'utilisateur a le droit de publier un message dans la conversation
const isConversationMemberOrAdmin = require("../middleware/isConversationMemberOrAdmin");

//CREATE : créer un message dans une conversation et renvoi le message enregistré en base
router.post('/', isConversationMemberOrAdmin, Message.createOne);

//READ : récupérer un message par son id
router.get('/:id', isMessageOwnerOrAdmin, Message.findOne);

//READ : récupérer tous les messages d'une conversation
router.get('/conversation/:id', isConversationMemberOrAdmin, Message.readAllByConversationId);

//READ : récupérer tous les messages actifs d'une conversation
router.get('/actives/conversation/:id', isConversationMemberOrAdmin, Message.readAllActiveByConversationId);

//READ : récupérer le dernier message d'une conversation au client
router.get('/latest/conversation/:id', isConversationMemberOrAdmin, Message.readLatestByConversationId);

//UPDATE : mettre à jour un message
router.put('/:id', isMessageOwnerOrAdmin, Message.updateOne);

//UPDATE : modérer un message
router.put('/moderate/:id', isMessageOwnerOrAdmin, Message.moderateOne);

//UPDATE : rétablir un message modéré
router.put('/restore/:id', isMessageOwnerOrAdmin, Message.restoreOne);

//DELETE : supprimer un message
router.delete('/:id', isMessageOwnerOrAdmin, Message.deleteOne);

module.exports = router;