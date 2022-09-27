const express = require('express');
const router = express.Router();
const Conversation = require('../controller/conversation.controller');

// CREATE one conversation
router.post('/', Conversation.createOne)

//READ all conversations
router.get('/', Conversation.findAll);

//READ all conversations in which a user participates
router.get('/user', Conversation.findAllByUserId);

// UPDATE one conversation
router.put('/:id', Conversation.updateOne);

// DELETE one conversation
router.delete('/:id', Conversation.deleteOne);

module.exports = router;