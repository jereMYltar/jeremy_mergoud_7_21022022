const express = require('express');
const router = express.Router();
const users = require('../controller/user.controller.js');

// Create one User
router.post('/', users.createOne);

// Retrieve all User
router.get('/', users.findAll);

// Retrieve all User
router.get('/:id', users.findOne);

// Update one User
router.put('/:id', users.updateOne);

// Delete one User
router.delete('/:id', users.deleteOne);

module.exports = router;