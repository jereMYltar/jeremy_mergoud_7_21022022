const Conversation = require('../model/conversation.model');
const UserConversation = require('../model/user_conversation.model');

//CREATE : créer une conversation
exports.createOne = async (req, res) => {
    let conversation = {
        name: req.body.name,
        conversationAdminId: res.locals.userId,
    };
    try {
        const newConversation = await Conversation.create(conversation);
        const newConsversationId = newConversation.dataValues.id;
        const userList = req.body.users;
        for await (const userId of userList) {
            UserConversation.create({
                user_id: userId,
                conversation_id: newConsversationId,
            })
        };
        res.status(201).json({
            customMessage: 'Conversation créée avec succès',
            body: {
                id: newConsversationId,
                name: req.body.name
            }
        });
    } catch (error) {
        res.status(400).json({
            errorMessage: error
        });
    }
};

//READ : récupérer toutes les conversations
exports.findAll = (req, res) => {
    Conversation.findAll()
    .then(conversations => {
        // Renvoie toutes les conversations au client
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

//READ : récupérer toutes les conversations auxquelles participe un utilisateur
exports.findAllByUserId = (req, res) => {
    Conversation.findAllByUserId(res.locals.userId)
    .then(conversations => {
        // Renvoie toutes les conversations récépérées au client
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

//UPDATE : mettre à jour une conversation
exports.updateOne = (req, res) => {
    const conversationId = req.params.id;
    const conversationUpdated = req.body.conversation;
    Conversation.update(conversationUpdated, {
        where: {
            id: conversationId
        }
    })
    .then(() => {
        res.status(200).json({
            customMessage: 'Conversation mise à jour avec succès'
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//DELETE : supprimer une Conversation
exports.deleteOne = (req, res) => {
    Conversation.destroy({ where: {id: req.params.id}})
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

