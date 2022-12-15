const MessageModel = require('../model/message.model');

//CREATE : créer un message et renvoi le message enregistré en base
exports.createOne = async (req, res) => {
  let message = {
    messageOwnerId: res.locals.user.id,
    content: req.body.content,
    conversation_id: req.params.conversationId,
    isModerated: 0,
    isGlobal: req.body.isGlobal,
  };
  try {
    const messageCreated = await MessageModel.create(message);
    const newMessage = messageCreated.dataValues;
    newMessage.author = res.locals.user.firstName.concat(" ", res.locals.user.lastName);
    newMessage.isAuthor = true;
    newMessage.hasRightsOn = true;
    delete newMessage.conversation_id;
    res.status(201).json({
      customMessage: 'Message créé avec succès',
      body: newMessage,
    });
  } catch (error) {
    res.status(400).json({
      errorMessage: error
    });
  }
};

//READ : récupérer un message par son id
// exports.findOne = async (req, res) => {
//   const messageId = req.params.messageId;
//   try {
//     const message = await MessageModel.findOneById(messageId)
//     res.status(200).json(
//       message
//     );
//   } catch (error) {
//      res.status(400).json({
//       error: error
//     });   
//   }
// };

//READ : récupérer tous les messages d'une conversation
exports.readAllByConversationId = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    let messages = await MessageModel.findAllByConversationId(conversationId);
    const userId = res.locals.user.id;
    const isAdmin = res.locals.user.isAdmin;
    for (let message of messages) {
      message.hasRightsOn = (isAdmin || message.messageOwnerId == userId);
      message.isAuthor = message.messageOwnerId == userId;
    };
    res.status(200).json(
      messages
    );
  } catch (error) {
    res.status(400).json({
      error: error
    });
  }
};

//UPDATE : mettre à jour un message
exports.updateOne = async (req, res) => {
  try {
    await MessageModel.update(req.body, {
      where: {
        id: req.params.messageId,
      }
    })
    const updatedMessage = await MessageModel.findOneById(req.params.messageId);
    let response = req.body;
    response.id = updatedMessage[0].id;
    response.updatedAt = updatedMessage[0].updatedAt;
    res.status(200).json({
      customMessage: 'Message mis à jour avec succès',
      body: response
    });  
  } catch (error) {
    res.status(401).json({
      error: error
    });
  }
};

//DELETE : supprimer un message
exports.deleteOne = async (req, res) => {
  try {
    await MessageModel.destroy({ where: {
      id: res.locals.message.id
    }})
    res.status(200).json({
      customMessage: 'Message supprimé avec succès'
    });    
  } catch (error) {
    res.status(400).json({
      error: error
    });
  }  
};
