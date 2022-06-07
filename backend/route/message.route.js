const express = require('express');
const router = express.Router();
const messages = require('../controller/message.controller');

//CREATE one Message
router.post('/', messages.createOne)

// READ one Message from a conversation
router.get('/:id', messages.findOne);

// UPDATE one Message
router.put('/:id', messages.updateOne);

// DELETE one Message
router.delete('/:id', messages.deleteOne);

module.exports = router;