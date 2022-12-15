const ConversationModel = require('../model/conversation.model');

module.exports = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const conversationId = req.params.conversationId;
        const conversation = await ConversationModel.findOne({ where: {id: conversationId}})
        if (user.isAdmin || conversation.conversationOwnerId == user.id) {
            res.locals.conversation = conversation.dataValues;
            next();
        } else {
            throw 'Requête non autorisée.';
        }
    } catch {
        res.status(401).json({ error : 'Requête non autorisée.' });
    }
};

