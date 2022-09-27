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
        .then((newMessage) => {
            User.findNameById(newMessage.dataValues.user_id)
                .then((user) => {
                    newMessage.dataValues.author = user[0].name;
                    newMessage.dataValues.isAuthor = true;
                    delete newMessage.dataValues.conversation_id;
                    delete newMessage.dataValues.user_id;
                    res.status(201).json({
                        message: 'Message créé avec succès',
                        body: newMessage.dataValues,
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

//READ one message by its id
exports.findOne = (req, res) => {
    const messageId = req.params.id;
    Message.findOneById(messageId)
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

//READ all messages from ONE conversation
exports.readAllByConversationId = (req, res) => {
    const conversationId = req.params.id;
    Message.findAllByConversationId(conversationId)
    .then(messages => {
        messages.forEach(message => {
            message.isAuthor = message.user_id == res.locals.userId;
            delete message.user_id;
        });
        // Send all messages from a conversation to Client
        res.status(200).json(
            messages
        );
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//READ all actives messages from ONE conversation
exports.readAllActiveByConversationId = (req, res) => {
    const conversationId = req.params.id;
    Message.findAllActiveByConversationId(conversationId)
    .then(messages => {
        messages.forEach(message => {
            message.isAuthor = message.user_id == res.locals.userId;
            delete message.user_id;
        });
        // Send all messages from a conversation to Client
        res.status(200).json(
            messages
        );
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//READ latest message from ONE conversation
exports.readLatestByConversationId = (req, res) => {
    const conversationId = req.params.id;
    Message.findLatestByConversationId(conversationId)
    .then(message => {
        // Send the latest message found from a conversation to Client
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

//UPDATE one message
exports.updateOne = (req, res) => {
    const messageId = req.params.id;
    const messageUpdated = req.body.message;
    Message.update(messageUpdated, {
        where: {
            id: messageId
        }
    })
    .then(() => {
        // Indicates that the message has been successfully updated
        res.status(200).json({
            message: 'Message mis à jour avec succès'
        });
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
