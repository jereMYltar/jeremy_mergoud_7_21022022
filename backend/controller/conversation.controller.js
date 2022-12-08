const Conversation = require('../model/conversation.model');
const UserConversation = require('../model/user_conversation.model');
const Message = require('../model/message.model');

//CREATE : créer une conversation
exports.createOne = async (req, res) => {
    let conversation = {
        name: req.body.name,
        conversationOwnerId: res.locals.user.id,
        isClosed: 0,
        isPublic: req.body.isPublic,
    };
    try {
        let newConversation = await Conversation.create(conversation);
        newConversation = newConversation.dataValues;
        delete newConversation.createdAt;
        delete newConversation.updatedAt;
        newConversation.hasRightsOn = true;
        if (!conversation.isPublic) {
            const userList = req.body.users;
            userList.push(res.locals.user.id);
            for await (const userId of userList) {
                UserConversation.create({
                    user_id: userId,
                    conversation_id: newConversation.id,
                })
            };;
        }
        res.status(201).json({
            customMessage: 'Conversation créée avec succès',
            body: newConversation,
        });
    } catch (error) {
        res.status(400).json({
            errorMessage: error
        });
    }
};

//READ : récupérer toutes les conversations auxquelles participe un utilisateur
exports.findAllAllowed = async (req, res) => {
    try {
        let conversations = await Conversation.findAllAllowed(res.locals.user.isAdmin, res.locals.user.id);
        const userId = res.locals.user.id;
        const isAdmin = res.locals.user.isAdmin;
        for (let conversation of conversations) {
            conversation.hasRightsOn = (isAdmin || conversation.conversationOwnerId == userId);
        };
        res.status(200).json(
            conversations
        );
    } catch (error) {
        res.status(400).json({
            error: error
        });
    }
};

//UPDATE : mettre à jour une conversation
exports.updateOne = (req, res) => {
    const conversationUpdated = req.body.conversation;
    Conversation.update(conversationUpdated, {
        where: {
            id: res.locals.conversation.id
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

//UPDATE : clôturer une conversation
exports.closeOne = (req, res) => {
    Conversation.update({isClosed: true}, {
        where: {
            id: res.locals.conversation.id
        }
    })
    .then(() => {
        res.status(200).json({
            customMessage: 'Conversation clôturée avec succès'
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//UPDATE : rouvrir une conversation clôturée
exports.reopenOne = (req, res) => {
    Conversation.update({isClosed: false}, {
        where: {
            id: res.locals.conversation.id
        }
    })
    .then(() => {
        res.status(200).json({
            customMessage: 'Conversation rétablie avec succès'
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//DELETE : supprimer une Conversation, tous ses messages, ainsi que toutes les relations user-conversation
exports.deleteOne = async (req, res) => {
    try {
        await Conversation.destroy({ where: {id: res.locals.conversation.id}});
        await Message.destroy({ where: {conversation_id: res.locals.conversation.id}});
        await UserConversation.destroy({ where: {conversation_id: res.locals.conversation.id}});
        res.status(200).json({
            customMessage: 'Conversation supprimée avec succès'
        });      
    } catch (error) {
        res.status(400).json({
            error: error
        });        
    }
};
