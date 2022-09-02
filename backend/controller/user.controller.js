const User = require('../model/user.model');


//CREATE one user
exports.createOne = (req, res) => {
    const user = JSON.parse(req.body.user);
    User.create(user)
        .then(() => {
            res.status(201).json({
                message: 'Utilisateur créé avec succès'
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

// READ all Users
exports.findAll = (req, res) => {
    User.findAllUsers()
        .then(users => {
	        // Send all users to Client
	        res.status(200).json(
                users
            );
	    })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

//READ one user searched by id
exports.findOneById = (req, res) => {
    User.findOne({ where: {id: req.params.id}})
        .then(user => {
            // Send user found to Client
	        if (!!user) {
                res.status(200).json(
                    user
                );
            } else {
                throw 'La ressource demandée n\'existe pas';
            };
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

//READ one user searched by email
exports.findOneByEmail = (req, res) => {
    User.findOne({ where: {email: req.body.email}})
        .then(user => {
            // Send user found to Client
	        if (!!user) {
                res.status(200).json(
                    user
                );
            } else {
                throw 'La ressource demandée n\'existe pas';
            };
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

//UPDATE one user
exports.updateOne = (req, res) => {
    const user = JSON.parse(req.body.user);
    User.update(user, {where: {id: req.params.id}})
        .then(() => {
            res.status(201).json({
                message: 'Utilisateur mis à jour avec succès'
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

//DELETE one user
exports.deleteOne = (req, res) => {
    User.destroy({ where: {id: req.params.id}})
    .then(() => {
        res.status(200).json({
            message: 'Utilisateur supprimé avec succès'
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};