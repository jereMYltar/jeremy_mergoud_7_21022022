// permet de vérifier si l'utilisateur connecté
// est administrateur ou membre de la conversation sur laquelle il tente d'agir
const UserConversation = require("../model/user_conversation.model");
const Conversation = require("../model/conversation.model");

module.exports = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const conversationId = req.params.conversationId;
    const conversation = await Conversation.findOne({
      where: { id: conversationId },
    });
    res.locals.conversation = conversation.dataValues;
    if (user.isAdmin || conversation.dataValues.isPublic) {
      next();
    } else {
      await UserConversation.findOne({
        where: {
          user_id: user.id,
          conversation_id: conversationId,
        },
      });
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: error,
      customMessage: "Requête non autorisée.",
    });
  }
};
