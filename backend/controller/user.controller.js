const UserModel = require('../model/user.model');
const UserConversationModel = require("../model/user_conversation.model");
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const env = require('../config/env');

//CREATE : créer un nouvel utilisateur
exports.signup2 = async (req, res, next) => {
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

//upsert user : si existant => UPDATE / si non existant => INSERT
exports.signup = async (req, res) => {
    try {
        let newUserData = req.body;
        if (!newUserData.id) {
            delete newUserData.id;
        } else {
            let existingUser = await UserModel.findOne({ where: {id: newUserData.id}});
            if (!existingUser || existingUser.dataValues.accountDeleted) {
                throw "Le compte que vous recherchez n'existe pas ou a été supprimé.";
            };
            existingUser = existingUser.dataValues;
            if (
                newUserData.isAdmin &&
                !existingUser.isAdmin &&
                newUserData.adminPassword != env.ADMIN_PASSWORD
            ) {
                throw "Le mot de passe administrateur renseigné est erroné.";
            }
            if (newUserData.initialPassword) {
                const valid = await argon2.verify(existingUser.password, newUserData.initialPassword);
                if (!valid) {
                    throw "Le mot de passe saisi est incorrect";
                }
            }
        }
        if (!newUserData.password) {
            delete newUserData.password;
        } else {
            newUserData.password = await argon2.hash(newUserData.password);
        }
        delete newUserData.adminPassword;
        delete newUserData.initialPassword;
        let userUpserted = await UserModel.upsert(newUserData);
        userUpserted = userUpserted[0].dataValues;
        let response = {
            user: {
                isAdmin: userUpserted.isAdmin,
                id: userUpserted.id,
                name: userUpserted.firstName.concat(" ",userUpserted.lastName),
            },
        };
        if (!newUserData.id) {
            response.customMessage = "Utilisateur créé avec succès";
            response.token = jwt.sign(
                {userId: userUpserted.id,
                isAdmin: userUpserted.isAdmin},
                env.JWT_SALT,
                {expiresIn: "12h"}
            );
        } else {
            response.customMessage = "Utilisateur mis à jour avec succès";
        }
        res.status(201).json(response);   
    } catch (error) {
        if (error) {
            res.status(400).json({
                errorMessage: error
            })
        } else {
            res.status(500).json({
                errorMessage: "Erreur serveur, veuillez réessayer."
            })
        }
    }
};

//READ : permettre la connexion d'un utilisateur créé en renvoyant le token d'authentification 
exports.login = async (req, res, next) => {
    try {
        let user = await UserModel.findOne({ where: {email: req.body.email}});
        if (!user) {
            throw "L'identifiant saisi est incorrect.";
        };
        user = user.dataValues;
        const valid = await argon2.verify(user.password, req.body.password);
        if (!valid) {
            throw "Mot de passe incorrect";
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
    } catch (error) {
        if (error) {
            res.status(400).json({
                errorMessage: error
            })
        } else {
            res.status(500).json({
                errorMessage: "Erreur serveur, veuillez réessayer."
            })
        }
    }
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

// READ : récupére toutes les informations d'un utilisateur
exports.findUserDetails = async (req, res) => {
    if (res.locals.user.id == req.params.userId) {
        res.status(200).json({
            customMessage: "Informations sur l'utilisateur connecté correctement récupérées.",
            userDetails: {
                id: res.locals.user.id,
                firstName: res.locals.user.firstName,
                lastName: res.locals.user.lastName,
                email: res.locals.user.email,
                isAdmin: res.locals.user.isAdmin,
                isMale: res.locals.user.isMale,
                photo: res.locals.user.photo,
                pseudo: res.locals.user.pseudo,
            },
        });
    } else {
        try {
            let user = await UserModel.findOne({ where: {id: req.params.userId}});
            if (!user) {
                throw "L'identifiant saisi est incorrect.";
            };
            user = user.dataValues;
            res.status(200).json({
                customMessage: "Informations sur l'utilisateur connecté correctement récupérées.",
                userDetails: {
                    id: req.params.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    isMale: user.isMale,
                    photo: user.photo,
                    pseudo: user.pseudo,
                },
            });
        } catch (error) {
            if (error) {
                res.status(400).json({
                    errorMessage: error
                })
            } else {
                res.status(500).json({
                    errorMessage: "Erreur serveur, veuillez réessayer."
                })
            }
        }
    }
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
exports.deleteOne = async (req, res) => {
    try {
        userId = req.params.userId;
        let existingUser = await UserModel.findOne({ where: {id: userId}});
        existingUser = existingUser.dataValues;
        const userToDelete = {
            id: userId,
            firstName: anonymize(existingUser.firstName),
            lastName: anonymize(existingUser.lastName),
            isMale: false, //unused yet
            email: anonymize(existingUser.email),
            pseudo: "", //unused yet
            photo: "", //unused yet
            password: "**********",
            isAdmin: false,
            accountDeleted: true,
        };
        await UserConversationModel.destroy({ where: {user_id: userId}});
        await UserModel.upsert(userToDelete);
        res.status(201).json({
            customMessage: 'Utilisateur supprimé avec succès'
        });
    } catch (error) {
        res.status(555).json({
            errorMessage: "Erreur serveur, veuillez réessayer."
        })
    }
};

function anonymize (str) {
    const strSplited = str.split("@");
    let stringSplited = strSplited[0].slice(0, 3);
    let n = stringSplited.length;
    while (n < 10) {
        stringSplited = stringSplited.concat("*");
        n++;
    }
    if (strSplited.length > 1) {
        return stringSplited.concat("_", Date.now(), "@", strSplited[1]);
    } else {
        return stringSplited
    }
};
