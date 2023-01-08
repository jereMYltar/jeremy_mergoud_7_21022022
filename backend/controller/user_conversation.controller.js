const UserConversationModel = require("../model/user_conversation.model");

// UPDATE : mettre à jour les utilisateurs d'une conversation à partir de l'Id de la conversation :
// - supprime les utilisateurs qui ont quitté la conversation (suppression de la relation)
// - ajoute les utilisateurs qui ont rejoints la conversation (création de la relation)
exports.updateAllMembers = async (toAdd, toDelete, conversationId) => {
  try {
    for (const userId of toDelete) {
      await UserConversationModel.destroy({
        where: {
          conversation_id: conversationId,
          user_id: userId,
        },
      });
    }
    for (const userId of toAdd) {
      await UserConversationModel.create({
        conversation_id: conversationId,
        user_id: userId,
      });
    }
    const users = await UserConversationModel.findAllMembersByConversationId(
      conversationId
    );
    return users;
  } catch {
    throw "La liste des membres n'a pas pu être mise à jour";
  }
};
