const Conversation = require('../model/conversation.model');
const UserConversation = require('../model/user_conversation.model');

//définition des fonctions de base du modèle :
//- message CREATE : requête de base de Sequelize => create. Requiert un objet contenant name et conversationAdminId
//- message READ : requêtes brutes ci-dessous
//      READ toutes les conversations auxquelles participe un utilisateur (sur la base de son id)
//- message UPDATE : requête de base de Sequelize => update. Requiert un objet contenant content (pour la modification du contenu) et/ou isModerated (pour la modération du message), ainsi que l'id du message modifié (pour la clause WHERE)
//- message DELETE : requête de base de Sequelize => destroy. Requiert l'id du message modifié (pour la clause WHERE)

//CREATE one conversation
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
            message: 'Conversation créée avec succès',
            body: newConversation.dataValues,
        });
    } catch (error) {
        res.status(408).json({
            errorMessage: error
        });
    }
};

//READ ALL conversations
exports.findAll = (req, res) => {
    Conversation.findAll()
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

//READ ALL conversations in which a user participates
exports.findAllByUserId = (req, res) => {
    Conversation.findAllByUserId(res.locals.userId)
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

//UPDATE one conversation
exports.updateOne = (req, res) => {
    const conversationId = req.params.id;
    const conversationUpdated = req.body.conversation;
    Conversation.update(conversationUpdated, {
        where: {
            id: conversationId
        }
    })
    .then(() => {
        // Indicates that the conversation has been successfully updated
        res.status(200).json({
            message: 'Conversation mise à jour avec succès'
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//DELETE one Conversation
exports.deleteOne = (req, res) => {
    Conversation.destroy({ where: {id: req.params.id}})
    .then(() => {
        res.status(200).json({
            message: 'Conversation supprimée avec succès'
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

