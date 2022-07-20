const express = require('express');
const router = express.Router();
const conversations = require('../controller/conversation.controller');

//CREATE one conversation
// router.post('/', conversations.createOne)

// READ all Messages from a conversation
router.get('/details/:id', conversations.findOne);

//READ all conversations in which a user participates
router.get('/', conversations.findAll);

// UPDATE one conversation
// router.put('/:id', conversations.updateOne);

// DELETE one conversation
// router.delete('/:id', conversations.deleteOne);

module.exports = router;