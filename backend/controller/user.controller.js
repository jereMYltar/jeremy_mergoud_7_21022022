const User = require('../model/user.model');

// GET all Users
exports.findAll = (req, res) => {
    User.findAll()
        .then(users => {
	        // Send all users to Client
	        //res.send(users);
            console.log(1);
	    })
        .catch(error => {
            console.log(error);
        });
};