const UserConversation = require('../model/user_conversation.model');

module.exports = (req, res, next) => {
    try {
        const user = res.locals.user;
        const conversationId = req.params.id;
        if (user.isAdmin) {
            next();
        } else {
            UserConversation.findOne({
                where: {
                    user_id: user.id,
                    conversation_id: conversationId,
                }
            })
            .then(() => {
                next();
            })
            .catch(() => {
                res.status(401).json({ error : 'Requête non autorisée.' });
            });
        }
    } catch {
        res.status(401).json({ error : 'Requête non autorisée.' });
    }
};

