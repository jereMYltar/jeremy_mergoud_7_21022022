// permet de vérifier si la conversation est verrouillée (open) ou non
// => blocage des actions lorsqu'elle est verrouillée
module.exports = (req, res, next) => {
  if (!res.locals.conversation.isClosed) {
    next();
  } else {
    res.status(401).json({ error: "Requête non autorisée." });
  }
};
