const express = require('express');
const router = express.Router();
const Conversation = require('../controller/conversation.controller');

// CREATE one conversation
router.post('/', Conversation.createOne)

// READ all Messages from a conversation
router.get('/details/:id', Conversation.findOne);

//READ all conversations in which a user participates
router.get('/', Conversation.findAll);

// UPDATE one conversation
// router.put('/:id', Conversation.updateOne);

// DELETE one conversation
// router.delete('/:id', Conversation.deleteOne);

module.exports = router;