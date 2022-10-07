const UserConversation = require('../model/user_conversation.model');

//CREATE : créer une relation user_conversation
exports.createOne = (req, res) => {
    let conversation = {
        name: req.body.name,
        conversationAdminId: res.locals.userId,
    };
    UserConversation.create(conversation)
        .then((response) => {
            console.log(response.dataValues.id);
            console.log(req.body);
            // console.log(typeof response);
            res.status(201).json({
                customMessage: 'Conversation créée avec succès',
                body: response.dataValues,
                // conversation: response.dataValues,
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

