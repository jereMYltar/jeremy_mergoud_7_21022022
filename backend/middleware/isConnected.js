const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${env.JWT_SALT}`);
        const userId = decodedToken.userId;
        const user = await User.findOne({ where: {id: userId}})
        if (!user.dataValues.accountDeleted) {
            res.locals.user = user.dataValues;
            next();
        } else {
            throw {
                status: 401,
                customMessage: "Ce compte a été supprimé. Veuillez contacter votre administrateur.",
            };
        }
    } catch(error) {
        if (error = "TokenExpiredError: jwt expired") {
            res.status(498).json({ customMessage : error })
        } else {
            res.status(error.status).json({ customMessage : error.customMessage })
        }
    }
};

