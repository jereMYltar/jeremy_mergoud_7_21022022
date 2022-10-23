const express = require('express');
const router = express.Router();
const messages = require('../controller/message.controller');

//CREATE : créer un message et renvoi le message enregistré en base
router.post('/', messages.createOne);

//READ : récupérer un message par son id
router.get('/:id', messages.findOne);

//READ : récupérer tous les messages d'une conversation
router.get('/conversation/:id', messages.readAllByConversationId);

//READ : récupérer tous les messages actifs d'une conversation
router.get('/actives/conversation/:id', messages.readAllActiveByConversationId);

//READ : récupérer le dernier message d'une conversation au client
router.get('/latest/conversation/:id', messages.readLatestByConversationId);

//UPDATE : mettre à jour un message
router.put('/:id', messages.updateOne);

//UPDATE : modérer un message
router.put('/moderate/:id', messages.moderateOne);

//UPDATE : rétablir un message modéré
router.put('/restoreOne/:id', messages.restoreOne);

//DELETE : supprimer un message
router.delete('/:id', messages.deleteOne);

module.exports = router;