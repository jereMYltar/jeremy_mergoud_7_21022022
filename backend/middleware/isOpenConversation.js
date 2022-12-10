module.exports = (req, res, next) => {
    if (!res.locals.conversation.isClosed) {
        next();
    } else {
        res.status(401).json({ error : 'Requête non autorisée.' });
    }
};

