// permet de vérifier si l'utilisateur connecté
// peut créer ou mettre à jour une conversation donnée
const ConversationModel = require("../model/conversation.model");

module.exports = async (req, res, next) => {
  const user = res.locals.user;
  const newConversation = req.body;
  if (user.isAdmin) {
    next();
  } else if (newConversation.id == 0) {
    switch (newConversation.isPublic) {
      case false:
        next();
        break;
      case true:
        res.status(401).json({ error: "Requête non autorisée." });
        break;
    }
  } else {
    try {
      const conversation = await ConversationModel.findOne({
        where: { id: newConversation.id },
      });
      if (conversation.dataValues.conversationOwnerId == res.locals.user.id) {
        res.locals.conversation = conversation.dataValues;
        next();
      } else {
        throw "Requête non autorisée.";
      }
    } catch {
      res.status(401).json({ error: "Requête non autorisée." });
    }
  }
};
