// modèle de fichier de configuration contenant les données nécessaires au fonctionnement du serveur :
// - connexion à la base de donnée MySQL
// - gestion du mot de passe pour pouvoir devenir administrateur de l'application
// => le fichier sera à renommer env.js après remplissage
const env = {
  DB_NAME: "nom de la base de données", //remplacer par le nom de la base de donnée mySQL
  DB_USERNAME: "nom utilisateur", //remplacer par le nom de l'utilisateur de la BdD
  DB_PASSWORD: "mot de passe", //remplacer par le mt de passe de l'utilisateur concerné
  DB_HOST: "localhost", //l'hôte de la base de donnée
  DB_DIALECT: "mysql",
  JWT_SALT: "clef de salage", //remplacer par une clef de salage pour l'encryptage du mot de passe utilisateur
  ADMIN_PASSWORD: "123", //remplacer par un mot de passe administrateur permettant à un utilisateur de devenir lui-même administrateur
};

module.exports = env;
