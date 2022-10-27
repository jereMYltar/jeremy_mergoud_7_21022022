const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${env.JWT_SALT}`);
        const userId = decodedToken.userId;
        User.findOne({ where: {id: userId}})
            .then((user) => {
                if (user.dataValues.accountDeleted) {
                    throw "Ce compte a été supprimé. Veuillez contacter votre administrateur."
                } else {
                    res.locals.user = {
                        id: user.dataValues.id,
                        isAdmin: user.dataValues.isAdmin,
                        accountDeleted: user.dataValues.accountDeleted,
                    };
                    next();
                }
            })
            .catch(() => {
                res.status(404).json({ error : 'user not found.' })
            });
    } catch {
        res.status(401).json({ error : 'unauthorized request.' })
    }
};

