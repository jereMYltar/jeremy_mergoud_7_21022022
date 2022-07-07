const Message = require('../model/message.model');

//CREATE one user
exports.createOne = (req, res) => {
    const message = req.body.message;
    Message.create(message)
        .then(() => {
            res.status(201).json({
                message: 'Message créé avec succès'
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
    Message.findMessage(messageId)
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

