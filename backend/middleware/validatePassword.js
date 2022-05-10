const schema = require('../model/password.model');

module.exports = (req, res, next) => {
    if (!!schema.validate(req.body.user.password)) {
        next();
    }
    else {
        res.status(400).json({ error: 'Mot de passe trop simple!' })
    }
};