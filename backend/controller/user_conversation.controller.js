const UserConversation = require('../model/user_conversation.model');

//CREATE : créer une relation user_conversation
exports.createOne = (req, res) => {
    let conversation = {
        name: req.body.name,
        conversationOwnerId: res.locals.user.id,
    };
    UserConversation.create(conversation)
        .then((response) => {
            res.status(201).json({
                customMessage: 'Conversation créée avec succès',
                body: response.dataValues,
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

//DELETE : supprimer une relation user_conversation
exports.deleteOne = (req, res) => {
    UserConversation.destroy({ where: {id: req.params.id}})
    .then(() => {
        res.status(200).json({
            customMessage: 'Conversation supprimée avec succès'
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

