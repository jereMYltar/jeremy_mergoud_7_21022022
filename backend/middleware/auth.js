const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${env.JWT_SALT}`);
        const userId = decodedToken.userId;
        User.findOneLimitedById(userId)
            .then((user) => {
                res.locals.user = user[0];
                next();
            })
            .catch(() => {
                res.status(404).json({ error : 'user not found.' })
            });
    } catch {
        res.status(401).json({ error : 'unauthorized request.' })
    }
};

