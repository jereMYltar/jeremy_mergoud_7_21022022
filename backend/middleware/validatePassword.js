const schema = require("../model/password.model");

module.exports = (req, res, next) => {
  const user = req.body;
  if ((user.id && !user.password) || !!schema.validate(user.password)) {
    next();
  } else {
    res.status(400).json({ customMessage: "Mot de passe trop simple!" });
  }
};
