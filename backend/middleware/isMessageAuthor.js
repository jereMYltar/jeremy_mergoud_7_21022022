const Message = require('../model/message.model');

module.exports = (req, res, next) => {
    try {
        const userId = res.locals.user.id;
        const messageId = req.params.id;
        Message.findOne({ where: {id: messageId}})
            .then((message) => {
                if (message.messageOwnerId == userId) {
                    res.locals.message = message.dataValues;
                    next();
                } else {
                    res.status(401).json({ error : 'Requête non autorisée.' });
                }
            })
            .catch(() => {
                res.status(404).json({ error : 'Message non trouvé.' });
            });
    } catch {
        res.status(401).json({ error : 'Requête non autorisée.' });
    }
};

