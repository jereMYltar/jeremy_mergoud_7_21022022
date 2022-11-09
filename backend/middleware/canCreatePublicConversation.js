module.exports = (req, res, next) => {
    if (req.body.isPublic && !res.locals.user.isAdmin) {
        res.status(401).json({ error : 'Requête non autorisée.' });
        console.log("erreur canCreatePublicConversation");
    } else {
        next();
    }
};

