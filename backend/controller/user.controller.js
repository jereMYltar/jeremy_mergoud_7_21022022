const User = require('../model/user.model');

// GET all Users
exports.findAll = (req, res) => {
    User.findAll()
        .then(users => {
	        // Send all users to Client
            console.log(users);
	        res.send(users);
	    })
        .catch(error => {
            console.log(error);
        });
};