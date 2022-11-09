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
        delete newMessage.conversation_id;
        delete newMessage.messageOwnerId;
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
exports.readAllByConversationId = (req, res) => {
    const conversationId = req.params.id;
    Message.findAllByConversationId(conversationId)
    .then(messages => {
        messages.forEach(message => {
            message.isAuthor = message.messageOwnerId == res.locals.user.id;
            delete message.messageOwnerId;
        });
        // Renvoie tous les messages d'une conversation au client
        res.status(200).json(
            messages
        );
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//READ : récupérer tous les messages actifs d'une conversation
exports.readAllActiveByConversationId = (req, res) => {
    const conversationId = req.params.id;
    Message.findAllActiveByConversationId(conversationId)
    .then(messages => {
        messages.forEach(message => {
            message.isAuthor = message.messageOwnerId == res.locals.user.id;
            delete message.messageOwnerId;
        });
        // Renvoie tous les messages d'une conversation au client
        res.status(200).json(
            messages
        );
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

//READ : récupérer le dernier message d'une conversation au client
exports.readLatestByConversationId = (req, res) => {
    const conversationId = req.params.id;
    Message.findLatestByConversationId(conversationId)
    .then(message => {
        // Renvoie le dernier message d'une conversation au client
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

//UPDATE : mettre à jour un message
exports.updateOne = (req, res) => {
    const messageUpdated = req.body.message;
    Message.update(messageUpdated, {
        where: {
            id: res.locals.message.id,
        }
    })
    .then(() => {
        res.status(200).json({
            customMessage: 'Message mis à jour avec succès'
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
