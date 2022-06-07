const express = require('express');
const router = express.Router();
const conversations = require('../controller/conversation.controller');

//CREATE one conversation
// router.post('/', conversations.createOne)

// READ all Messages from a conversation
router.get('/:id', conversations.findOne);

// UPDATE one conversation
// router.put('/:id', conversations.updateOne);

// DELETE one conversation
// router.delete('/:id', conversations.deleteOne);

module.exports = router;