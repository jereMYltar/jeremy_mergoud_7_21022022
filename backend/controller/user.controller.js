const UserModel = require('../model/user.model');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const env = require('../config/env');

//CREATE : créer un nouvel utilisateur
exports.signup = async (req, res, next) => {
    const user = req.body.user;
    try {
        const hash = await argon2.hash(user.password);
        user.password = hash;
        let createdUser = await UserModel.create(user);
        createdUser = createdUser.dataValues;
        res.status(201).json({
            customMessage: 'Utilisateur créé avec succès',
            token: jwt.sign(
                {userId: createdUser.id,
                isAdmin: createdUser.isAdmin},
                env.JWT_SALT,
                {expiresIn: "12h"}
            ),
            activeUser: {
                isAdmin: createdUser.isAdmin,
                id: createdUser.id,
                name: createdUser.firstName.concat(" ",createdUser.lastName),
            }
        });        
    } catch (error) {
        res.status(500).json({ error : error });
    }
};

//READ : permettre la connexion d'un utilisateur créé en renvoyant le token d'authentification 
exports.login = (req, res, next) => {
    UserModel.findOne({ where: {email: req.body.email}})
        .then(
            (sequelizeInstance) => {
                if (!sequelizeInstance) {
                        return res.status(401).json({ error: 'Utilisateur non trouvé' })
                    }
                const user = sequelizeInstance.toJSON();
                argon2.verify(user.password, req.body.password)
                    .then(
                        (valid) => {
                            if (!valid) {
                                return res.status(403).json({ error: 'Requête non autorisée' })
                            }
                            res.status(200).json({
                                customMessage: "Connexion réussie",
                                token: jwt.sign(
                                    {userId: user.id,
                                    isAdmin: user.isAdmin},
                                    env.JWT_SALT,
                                    {expiresIn: "12h"}
                                ),
                                activeUser: {
                                    isAdmin: user.isAdmin,
                                    id: user.id,
                                    name: user.firstName.concat(" ",user.lastName),
                                }
                            })
                        }
                    )
                    .catch(
                        (error) => res.status(500).json({error: error})
                    );
            }
        )
        .catch(
            (error) => {
                res.status(500).json({error: error})
            }
        );
};

//CREATE : créer un utilisateur
// exports.createOne = (req, res) => {
//     const user = JSON.parse(req.body.user);
//     UserModel.create(user)
//         .then(() => {
//             res.status(201).json({
//                 customMessage: 'Utilisateur créé avec succès'
//             });
//         })
//         .catch(error => {
//             res.status(400).json({
//                 error: error
//             });
//         });
// };

// READ : récupére les informations de base (id, isAdmin, name) de l'utilisateur courant
exports.findOneByToken = (req, res) => {
    res.status(200).json({
        customMessage: "Informations sur l'utilisateur connecté correctement récupérées.",
        activeUser: {
            isAdmin: res.locals.user.isAdmin,
            id: res.locals.user.id,
            name: res.locals.user.firstName.concat(" ", res.locals.user.lastName),
        },
    });
};

// READ : récupére toutes les informations d l'utilisateur courant
exports.findUserDetails = (req, res) => {
    res.status(200).json({
        customMessage: "Informations sur l'utilisateur connecté correctement récupérées.",
        activeUserDetails: {
            firstName: res.locals.user.firstName,
            lastName: res.locals.user.lastName,
            email: res.locals.user.email,
            isAdmin: res.locals.user.isAdmin,
            isMale: res.locals.user.isMale,
            photo: res.locals.user.photo,
            pseudo: res.locals.user.pseudo,
        },
    });
};

// READ : récupérer tous les utilisateurs
// exports.findAllUsers = (req, res) => {
//     UserModel.findAllUsers()
//         .then(users => {
// 	        // Send all users to Client
// 	        res.status(200).json(
//                 users
//                 //utilisateurs: users <= transformer en objet et mettre une clef ?
//             );
// 	    })
//         .catch(error => {
//             res.status(400).json({
//                 error: error
//             });
//         });
// };

// READ : récupérer tous les utilisateurs différents de l'utilisateur courant
exports.findAllOtherUsers = (req, res) => {
    UserModel.findAllOtherUsers(res.locals.user.id)
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
// exports.findOneById = (req, res) => {
//     UserModel.findOne({ where: {id: req.params.userId}})
//         .then(user => {
//             // Send user found to Client
// 	        if (!!user) {
//                 res.status(200).json(
//                     user
//                 );
//             } else {
//                 throw 'La ressource demandée n\'existe pas';
//             };
//         })
//         .catch(error => {
//             res.status(400).json({
//                 error: error
//             });
//         });
// };

//READ : récupérer une quantité d'information limité d'un utilisateur en fonction de son id
// exports.findOneLimitedById = (req, res) => {
//     UserModel.findOneLimitedById(req.params.userId)
//         .then(user => {
//             // Send user found to Client
// 	        if (!!user) {
//                 res.status(200).json(
//                     user
//                 );
//             } else {
//                 throw 'La ressource demandée n\'existe pas';
//             };
//         })
//         .catch(error => {
//             res.status(400).json({
//                 error: error
//             });
//         });
// };

//READ : récupérer un utilisateur en fonction de son email
// exports.findOneByEmail = (req, res) => {
//     UserModel.findOne({ where: {email: req.body.email}})
//         .then(user => {
//             // Send user found to Client
// 	        if (!!user) {
//                 res.status(200).json(
//                     user
//                 );
//             } else {
//                 throw 'La ressource demandée n\'existe pas';
//             };
//         })
//         .catch(error => {
//             res.status(400).json({
//                 error: error
//             });
//         });
// };

//UPDATE : mettre à jour un utilisateur
// exports.updateOne = (req, res) => {
//     const user = JSON.parse(req.body.user);
//     UserModel.update(user, {where: {id: req.params.userId}})
//         .then(() => {
//             res.status(201).json({
//                 customMessage: 'Utilisateur mis à jour avec succès'
//             });
//         })
//         .catch(error => {
//             res.status(400).json({
//                 error: error
//             });
//         });
// };

//DELETE : supprimer un utilisateur
// exports.deleteOne = (req, res) => {
//     UserModel.destroy({ where: {id: req.params.userId}})
//     .then(() => {
//         res.status(200).json({
//             customMessage: 'Utilisateur supprimé avec succès'
//         });
//     })
//     .catch(error => {
//         res.status(400).json({
//             error: error
//         });
//     });
// };