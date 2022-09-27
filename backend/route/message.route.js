const express = require('express');
const router = express.Router();
const messages = require('../controller/message.controller');

//CREATE one message
router.post('/', messages.createOne)

// READ one message from a conversation
router.get('/:id', messages.findOne);

// READ all messages from a conversation
router.get('/conversation/:id', messages.readAllByConversationId);

// READ all actives messages from a conversation
router.get('/actives/conversation/:id', messages.readAllActiveByConversationId);

// READ latest message from a conversation
router.get('/latest/conversation/:id', messages.readLatestByConversationId);

// UPDATE one message
router.put('/:id', messages.updateOne);

// DELETE one message
router.delete('/:id', messages.deleteOne);

module.exports = router;