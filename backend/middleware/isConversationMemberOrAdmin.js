const UserConversation = require('../model/user_conversation.model');
const Conversation = require('../model/conversation.model');

module.exports = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const conversationId = req.params.conversationId;
        const conversation = await Conversation.findOne({ where: {id: conversationId}});
        if (user.isAdmin || conversation.isPublic) {
            res.locals.conversation = conversation.dataValues;
            next();
        } else {
            const userConversation = await UserConversation.findOne({
                where: {
                    user_id: user.id,
                    conversation_id: conversationId,
                }
            })
            next();
        }
    } catch (error) {
        res.status(401).json({
            error : error,
            customMessage: 'Requête non autorisée.',
        });
    }
};

