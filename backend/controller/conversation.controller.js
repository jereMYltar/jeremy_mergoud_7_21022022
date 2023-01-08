const ConversationModel = require("../model/conversation.model");
const UserConversationModel = require("../model/user_conversation.model");
const UserConversationCtrl = require("../controller/user_conversation.controller");
const MessageModel = require("../model/message.model");
const UserModel = require("../model/user.model");

//INSERT+UPDATE => upsert conversation : si la conversation existe, alors elle est mise à jour, sinon elle est créée
exports.upsertOne = async (req, res) => {
  let conversation = req.body;
  if (!conversation.id) {
    delete conversation.id;
    conversation.conversationOwnerId = res.locals.user.id;
    conversation.members.toAdd.push(res.locals.user.id);
  }
  const members = conversation.members;
  delete conversation.members;
  try {
    const upsertion = await ConversationModel.upsert(conversation);
    let newConversation = await ConversationModel.findOne({
      where: { id: upsertion[0].dataValues.id },
    });
    newConversation.hasRightsOn =
      conversation.conversationOwnerId == newConversation.conversationOwnerId
        ? true
        : false;
    const newMembers = await UserConversationCtrl.updateAllMembers(
      members.toAdd,
      members.toDelete,
      newConversation.id
    );
    newConversation.members = newMembers;
    newConversation.owner = newMembers.find(
      (elt) => elt.id == newConversation.conversationOwnerId
    );
    res.status(201).json({
      customMessage: "Conversation créée avec succès",
      body: newConversation,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

//READ : récupérer toutes les conversations auxquelles participe un utilisateur
exports.findAllAllowed = async (req, res) => {
  try {
    let conversations = await ConversationModel.findAllAllowed(
      res.locals.user.isAdmin,
      res.locals.user.id
    );
    const userId = res.locals.user.id;
    const isAdmin = res.locals.user.isAdmin;
    for (let conversation of conversations) {
      conversation.hasRightsOn =
        isAdmin || conversation.conversationOwnerId == userId;
    }
    res.status(200).json(conversations);
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};

//READ : récupérer le détail d'une conversation à partir de son id
exports.findDetails = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = res.locals.user.id;
    const isAdmin = res.locals.user.isAdmin;
    let conversationDetails = await ConversationModel.findOne({
      where: { id: conversationId },
    });
    conversationDetails = conversationDetails.dataValues;
    conversationDetails.hasRightsOn =
      isAdmin || conversationDetails.conversationOwnerId == userId;
    if (conversationDetails.isPublic) {
      conversationDetails.members = [];
      const owner = await UserModel.findOne({
        where: { id: conversationDetails.conversationOwnerId },
      });
      conversationDetails.owner = {
        id: conversationDetails.conversationOwnerId,
        name: owner.dataValues.firstName.concat(" ", owner.dataValues.lastName),
      };
    } else {
      const users = await UserConversationModel.findAllMembersByConversationId(
        conversationId
      );
      let membersList = new Array(...users);
      conversationDetails.members = membersList;
      conversationDetails.owner = membersList.find(
        (elt) => elt.id == conversationDetails.conversationOwnerId
      );
    }
    console.log("contrôleur findDetails : ", conversationDetails);
    res.status(200).json({
      customMessage: `Détails de la conversation n°${conversationId} récupérés avec succès.`,
      body: conversationDetails,
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};

//DELETE : supprimer une Conversation, tous ses messages, ainsi que toutes les relations user-conversation
exports.deleteOne = async (req, res) => {
  try {
    await ConversationModel.destroy({
      where: { id: res.locals.conversation.id },
    });
    await MessageModel.destroy({
      where: { conversation_id: res.locals.conversation.id },
    });
    await UserConversationModel.destroy({
      where: { conversation_id: res.locals.conversation.id },
    });
    res.status(200).json({
      customMessage: "Conversation supprimée avec succès",
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};
