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

//READ : récupérer le détail d'une conversation à partir de son id
exports.findDetails = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const userId = res.locals.user.id;
        const isAdmin = res.locals.user.isAdmin;
        const conversation = await Conversation.findOneById(conversationId);
        const users = await UserConversation.findAllMembersByConversationId(conversationId);
        let conversationDetails = {...conversation[0]};
        let membersList = new Array(...users)
        conversationDetails.hasRightsOn = (isAdmin || conversation.conversationOwnerId == userId);
        conversationDetails.members = membersList;
        conversationDetails.owner = membersList.find((elt) => elt.id == conversationDetails.conversationOwnerId);
        res.status(200).json({
            customMessage: `Détails de la conversation n°${conversationId} récupérés avec succès.`,
            body: conversationDetails,
        });
    } catch (error) {
        res.status(400).json({
            error: error
        });
    }
};

//UPDATE : mettre à jour une conversation
exports.updateOne = async (req, res) => {
    try {
        await Conversation.update(req.body, {
            where: {
              id: req.params.conversationId,
            }
          })
          const updatedConversation = await Conversation.findOneById(req.params.conversationId);
          res.status(200).json({
            customMessage: 'Conversation mise à jour avec succès',
            body: updatedConversation[0]
          });  
    } catch (error) {
        res.status(486).json({
            error: error
          });
    }
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
