// permet de vérifier si l'utilisateur connecté est administrateur
module.exports = (req, res, next) => {
  if (res.locals.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Requête non autorisée." });
  }
};
