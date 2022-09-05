const express = require('express');
const router = express.Router();
const users = require('../controller/user.controller.js');

// Create one User
router.post('/', users.createOne);

// Retrieve all User
router.get('/all', users.findAllUsers);

// Retrieve one User searched by id
router.get('/find/:id', users.findOneById);

// Retrieve one User searched by id
router.get('/findEmail', users.findOneByEmail);

// Update one User
router.put('/:id', users.updateOne);

// Delete one User
router.delete('/:id', users.deleteOne);

module.exports = router;