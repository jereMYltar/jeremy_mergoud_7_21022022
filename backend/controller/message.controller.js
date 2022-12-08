const Message = require('../model/message.model');
const User = require('../model/user.model');

//CREATE : créer un message et renvoi le message enregistré en base
exports.createOne = async (req, res) => {
    let message = {
        messageOwnerId: res.locals.user.id,
        content: req.body.content,
        conversation_id: req.params.id,
        isModerated: 0,
        isGlobal: req.body.isGlobal,
    };
    try {
        const messageCreated = await Message.create(message);
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
exports.findOne = (req, res) => {
    const messageId = req.params.id;
    Message.findOneById(messageId)
    .then(message => {
        // Renvoie tous les messages au client
        res.status(200).json(
            message
        );
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//READ : récupérer tous les messages d'une conversation
exports.readAllByConversationId = async (req, res) => {
    try {
        const conversationId = req.params.id;
        let messages = await Message.findAllByConversationId(conversationId);
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
exports.updateOne = (req, res) => {
    const updatedMessage = req.body;
    console.log(res.locals);
    console.log(req.body);
    Message.update(updatedMessage, {
        where: {
            id: res.locals.message.id,
        }
    })
    .then(() => {
        updatedMessage.id = res.locals.message.id;
        res.status(200).json({
            customMessage: 'Message mis à jour avec succès',
            body: updatedMessage
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//UPDATE : modérer un message
exports.moderateOne = (req, res) => {
    Message.update({isModerated: true}, {
        where: {
            id: res.locals.message.id
        }
    })
    .then(() => {
        res.status(200).json({
            customMessage: 'Message modéré avec succès'
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//UPDATE : restaurer un message modéré
exports.restoreOne = (req, res) => {
    Message.update({isModerated: false}, {
        where: {
            id: res.locals.message.id
        }
    })
    .then(() => {
        res.status(200).json({
            customMessage: 'Message rétabli avec succès'
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//DELETE : supprimer un message
exports.deleteOne = (req, res) => {
    Message.destroy({ where: {
        id: res.locals.message.id
    }})
    .then(() => {
        res.status(200).json({
            customMessage: 'Message supprimé avec succès'
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};
