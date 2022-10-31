const Message = require('../model/message.model');

module.exports = (req, res, next) => {
    if (res.locals.user.id == req.params.id || res.locals.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ error : 'Requête non autorisée.' });
    }
};

