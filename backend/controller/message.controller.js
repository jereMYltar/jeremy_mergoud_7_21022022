const Message = require('../model/message.model');
const User = require('../model/user.model');

//CREATE : créer un message et renvoi le message enregistré en base
exports.createOne = async (req, res) => {
    const message = req.body.message;
    message.user_id = res.locals.userId;
    try {
        const newMessage = await Message.create(message)
        const user = await User.findNameById(newMessage.dataValues.user_id)
        newMessage.dataValues.author = user[0].name;
        newMessage.dataValues.isAuthor = true;
        delete newMessage.dataValues.conversation_id;
        delete newMessage.dataValues.user_id;
        res.status(201).json({
            customMessage: 'Message créé avec succès',
            body: newMessage.dataValues,
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
            message.isAuthor = message.user_id == res.locals.userId;
            delete message.user_id;
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
            message.isAuthor = message.user_id == res.locals.userId;
            delete message.user_id;
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
    const messageId = req.params.id;
    const messageUpdated = req.body.message;
    Message.update(messageUpdated, {
        where: {
            id: messageId
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

//DELETE : supprimer un message
exports.deleteOne = (req, res) => {
    Message.destroy({ where: {id: req.params.id}})
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
