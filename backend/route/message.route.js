const express = require('express');
const router = express.Router();
const Message = require('../controller/message.controller');
const isMessageAuthor = require('../middleware/isMessageAuthor');

//CREATE : créer un message et renvoi le message enregistré en base
router.post('/', Message.createOne);

//READ : récupérer un message par son id
router.get('/:id', Message.findOne);

//READ : récupérer tous les messages d'une conversation
router.get('/conversation/:id', Message.readAllByConversationId);

//READ : récupérer tous les messages actifs d'une conversation
router.get('/actives/conversation/:id', Message.readAllActiveByConversationId);

//READ : récupérer le dernier message d'une conversation au client
router.get('/latest/conversation/:id', Message.readLatestByConversationId);

//UPDATE : mettre à jour un message
router.put('/:id', isMessageAuthor, Message.updateOne);

//UPDATE : modérer un message
router.put('/moderate/:id', isMessageAuthor, Message.moderateOne);

//UPDATE : rétablir un message modéré
router.put('/restore/:id', isMessageAuthor, Message.restoreOne);

//DELETE : supprimer un message
router.delete('/:id', isMessageAuthor, Message.deleteOne);

module.exports = router;