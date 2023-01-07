// permet de vérifier si l'utilisateur connecté
// est le propriétaire du message sur lequel il tente d'agir
const Message = require("../model/message.model");

module.exports = (req, res, next) => {
  try {
    const user = res.locals.user;
    const messageId = req.params.messageId;
    Message.findOne({ where: { id: messageId } })
      .then((message) => {
        if (message.messageOwnerId == user.id) {
          res.locals.message = message.dataValues;
          res.locals.message.hasOwnershipRights = true;
          next();
        } else {
          res.status(403).json({ error: "Requête non autorisée." });
        }
      })
      .catch(() => {
        res.status(404).json({ error: "Message non trouvé." });
      });
  } catch {
    res.status(401).json({ error: "Requête non autorisée." });
  }
};
