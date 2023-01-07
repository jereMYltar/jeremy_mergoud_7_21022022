// permet de vérifier si l'utilisateur connecté
// est administrateur ou propriétaire du compte sur lequel il tente d'agir
const Message = require("../model/message.model");

module.exports = (req, res, next) => {
  if (res.locals.user.id == req.params.userId || res.locals.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Requête non autorisée." });
  }
};
