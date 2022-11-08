const UserConversation = require('../model/user_conversation.model');

module.exports = (req, res, next) => {
    UserConversation.findOne({
        where: {
            user_id: res.locals.user.id,
            conversation_id: req.body.message.conversation_id
        }
    })
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(401).json({ error : 'Requête non autorisée.' });
        });
};

