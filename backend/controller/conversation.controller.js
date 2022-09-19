const Conversation = require('../model/conversation.model');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

//CREATE one conversation
exports.createOne = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${env.JWT_SALT}`);
    let conversation = {
        name: req.body.name,
        conversationAdminId: decodedToken.userId,
    };
    Conversation.create(conversation)
        .then((response) => {
            // console.log(response.dataValues);
            // console.log(typeof response);
            res.status(201).json({
                message: 'Conversation créée avec succès',
                conversation: response.dataValues,
                // conversation: response.conversation.dataValues,
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

//READ all messages from ONE conversation
exports.findOne = (req, res) => {
    const conversationId = req.params.id;
    Conversation.findConversation(conversationId)
    .then(messages => {
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

//READ ALL conversations in which a user participates
exports.findAll = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${env.JWT_SALT}`);
    Conversation.findConversations(decodedToken.userId)
    .then(conversations => {
        // Send all messages from a conversation to Client
        res.status(200).json(
            conversations
        );
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//DELETE one conversation and all its messages
// exports.deleteOne = (req, res) => {
//     Message.destroy({ where: {id: req.params.id}})
//     .then(() => {
//         res.status(200).json({
//             message: 'Message supprimé avec succès'
//         });
//     })
//     .catch(error => {
//         res.status(400).json({
//             error: error
//         });
//     });
// };

//UPDATE one conversation
// exports.updateOne = (req, res) => {
//     const message = req.body.message;
//     Message.update(message, {where: {id: req.params.id}})
//         .then(() => {
//             res.status(201).json({
//                 message: 'Message mis à jour avec succès'
//             });
//         })
//         .catch(error => {
//             res.status(400).json({
//                 error: error
//             });
//         });
// };

