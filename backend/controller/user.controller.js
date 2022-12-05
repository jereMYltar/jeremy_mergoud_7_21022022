const User = require('../model/user.model');


//CREATE : créer un utilisateur
exports.createOne = (req, res) => {
    const user = JSON.parse(req.body.user);
    User.create(user)
        .then(() => {
            res.status(201).json({
                customMessage: 'Utilisateur créé avec succès'
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

// READ : récupére l'information d'utilisateur admin ou non de l'utilisateur courant
exports.findOneByToken = (req, res) => {
    res.status(200).json(
        res.locals.user.isAdmin
    );
};

// READ : récupérer tous les utilisateurs
exports.findAllUsers = (req, res) => {
    User.findAllUsers()
        .then(users => {
	        // Send all users to Client
	        res.status(200).json(
                users
                //utilisateurs: users <= transformer en objet et mettre une clef ?
            );
	    })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};
// READ : récupérer tous les utilisateurs différents de l'utilisateur courant
exports.findAllOtherUsers = (req, res) => {
    User.findAllUsers(res.locals.user.id)
        .then(users => {
	        // Send all users to Client
	        res.status(200).json(
                users
                //utilisateurs: users <= transformer en objet et mettre une clef ?
            );
	    })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

//READ : récupérer un utilisateur en fonction de son id
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

//READ : récupérer une quantité d'information limité d'un utilisateur en fonction de son id
exports.findOneLimitedById = (req, res) => {
    User.findOneLimitedById(req.params.id)
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

//READ : récupérer un utilisateur en fonction de son email
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

//UPDATE : mettre à jour un utilisateur
exports.updateOne = (req, res) => {
    const user = JSON.parse(req.body.user);
    User.update(user, {where: {id: req.params.id}})
        .then(() => {
            res.status(201).json({
                customMessage: 'Utilisateur mis à jour avec succès'
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

//DELETE : supprimer un utilisateur
exports.deleteOne = (req, res) => {
    User.destroy({ where: {id: req.params.id}})
    .then(() => {
        res.status(200).json({
            customMessage: 'Utilisateur supprimé avec succès'
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};