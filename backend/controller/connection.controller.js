const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const env = require('../config/env');

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
                    // console.log(user);
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

exports.login = (req, res, next) => {
    User.findOne({ where: {email: req.body.email}})
        .then(
            (sequelizeInstance) => {
                if (!sequelizeInstance) {
                        return res.status(401).json({ error: 'User not found' })
                    }
                const user = sequelizeInstance.toJSON();
                // console.log(user);
                argon2.verify(user.password, req.body.password)
                    .then(
                        (valid) => {
                            if (!valid) {
                                return res.status(403).json({ error: 'unauthorized request' })
                            }
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    {userId: user._id},
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