const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const env = require('../config/env');

//CREATE : créer un nouvel utilisateur
exports.signup = (req, res, next) => {
    const user = req.body.user;
    argon2.hash(user.password)
        .then((hash) => {
            user.password = hash
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
            })
        .catch((error) => {
                res.status(500).json({ error : error });
            });
};

//READ : permettre la connexion d'un utilisateur créé en renvoyant le token d'authentification 
exports.login = (req, res, next) => {
    User.findOne({ where: {email: req.body.email}})
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
                                token: jwt.sign(
                                    {userId: user.id,
                                    isAdmin: user.isAdmin},
                                    env.JWT_SALT,
                                    {expiresIn: '12h'}
                                )
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