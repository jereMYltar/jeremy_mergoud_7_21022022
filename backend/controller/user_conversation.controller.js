const UserConversationModel = require('../model/user_conversation.model');


//UPDATE : mettre à jour les utilisateurs d'une conversation identifiée par son id
// exports.updateAllMembersByConversationId = async (req, res) => {
//     const toDelete = req.body.toDelete;
//     const toAdd = req.body.toAdd;
//     const conversationId = req.params.conversationId;
//     try {
//         for (const userId of toDelete) {
//             await UserConversationModel.destroy({
//                 where: {
//                     conversation_id: conversationId,
//                     user_id: userId,
//                 }
//             })
//         }
//         for (const userId of toAdd) {
//             await UserConversationModel.create({
//                 conversation_id: conversationId,
//                 user_id: userId,
//             })
//         }
//         const users = await UserConversationModel.findAllMembersByConversationId(conversationId);
//         res.status(200).json({
//             customMessage: 'Liste des membres mise à jour avec succès',
//             body: users
//           }); 
//     } catch (error) {
//         res.status(400).json({
//             error: error
//         });
//     }
// };

exports.updateAllMembers = async (toAdd, toDelete, conversationId) => {
    try {
        for (const userId of toDelete) {
            await UserConversationModel.destroy({
                where: {
                    conversation_id: conversationId,
                    user_id: userId,
                }
            })
        }
        for (const userId of toAdd) {
            await UserConversationModel.create({
                conversation_id: conversationId,
                user_id: userId,
            })
        }
        const users = await UserConversationModel.findAllMembersByConversationId(conversationId);
        return users
    } catch {
        throw "La liste des membres n'a pas pu être mise à jour"
    }
};
