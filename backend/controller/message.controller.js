const Message = require('../model/message.model');
const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

//définition des fonctions de base du modèle :
//- message CREATE : requête de base de Sequelize => create. Requiert un objet contenant conversation_id, user_id et content
//- message READ : requêtes brutes ci-dessous
//      READ un message par son id :findById
//      READ tous les messages d'une conversation par l'id de celle-ci : findAllByConversationId
//      READ tous les messages actifs (non modérés) d'une conversation par l'id de celle-ci : findAllActiveByConversationId
//      READ le dernier message d'une conversation : findLatestByConversationId
//- message UPDATE : requête de base de Sequelize => update. Requiert un objet contenant content (pour la modification du contenu) et/ou isModerated (pour la modération du message), ainsi que l'id du message modifié (pour la clause WHERE)
//- message DELETE : requête de base de Sequelize => destroy. Requiert l'id du message modifié (pour la clause WHERE)






//CREATE one message and return the registered message
exports.createOne = (req, res) => {
    const message = req.body.message;
    message.user_id = res.locals.userId;
    Message.create(message)
        .then((response) => {
            console.log(response.dataValues.user_id);
            User.findById(response.dataValues.user_id)
                .then((user) => {
                    response.dataValues.author = user[0].name;
                    delete response.dataValues.conversation_id;
                    delete response.dataValues.user_id;
                    res.status(201).json({
                        message: 'Message créé avec succès',
                        body: response.dataValues,
                    });
                })
                .catch(error => {
                    res.status(400).json({
                        error: error
                    });
                });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

//READ one message from a conversation
exports.findOne = (req, res) => {
    const messageId = req.params.id;
    Message.findById(messageId)
    .then(message => {
        // Send all messages from a conversation to Client
        res.status(200).json(
            message
        );
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//DELETE one message
exports.deleteOne = (req, res) => {
    Message.destroy({ where: {id: req.params.id}})
    .then(() => {
        res.status(200).json({
            message: 'Message supprimé avec succès'
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

// TO UPDATE

//UPDATE one user
exports.updateOne = (req, res) => {
    const message = req.body.message;
    Message.update(message, {where: {id: req.params.id}})
        .then(() => {
            res.status(201).json({
                message: 'Message mis à jour avec succès'
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

