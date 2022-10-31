const Conversation = require('../model/conversation.model');

module.exports = (req, res, next) => {
    try {
        const user = res.locals.user;
        const conversationId = req.params.id;
        Conversation.findOne({ where: {id: conversationId}})
            .then((conversation) => {
                if (conversation.conversationOwnerId == user.id || user.isAdmin) {
                    res.locals.conversation = conversation.dataValues;
                    next();
                } else {
                    res.status(401).json({ error : 'Requête non autorisée.' });
                }
            })
            .catch(() => {
                res.status(404).json({ error : 'Conversation non trouvée.' });
            });
    } catch {
        res.status(401).json({ error : 'Requête non autorisée.' });
    }
};

