const Message = require('../model/message.model');

module.exports = (req, res, next) => {
    try {
        const user = res.locals.user;
        const messageId = req.params.id;
        Message.findOne({ where: {id: messageId}})
            .then((message) => {
                if (message.messageOwnerId == user.id || user.isAdmin) {
                    res.locals.message = message.dataValues;
                    res.locals.message.hasOwnershipRights = true;
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
