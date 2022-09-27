const UserConversation = require('../model/user_conversation.model');

//définition des fonctions de base du modèle :
//- message CREATE : requête de base de Sequelize => create. Requiert un objet contenant user_id et conversation_id
//- message DELETE : requête de base de Sequelize => destroy. Requiert l'id de la conversation ou du user supprimée (pour la clause WHERE)

//CREATE one user_conversation relation
exports.createOne = (req, res) => {
    let conversation = {
        name: req.body.name,
        conversationAdminId: res.locals.userId,
    };
    UserConversation.create(conversation)
        .then((response) => {
            console.log(response.dataValues.id);
            console.log(req.body);
            // console.log(typeof response);
            res.status(201).json({
                message: 'Conversation créée avec succès',
                body: response.dataValues,
                // conversation: response.dataValues,
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
};

//DELETE one Conversation
exports.deleteOne = (req, res) => {
    UserConversation.destroy({ where: {id: req.params.id}})
    .then(() => {
        res.status(200).json({
            message: 'Conversation supprimée avec succès'
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error
        });
    });
};

