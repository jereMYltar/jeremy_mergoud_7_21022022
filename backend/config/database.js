// configuration de la base de donnée dans sequelize (pour en gérer la connexion)
const env = require("../config/env");
const Sequelize = require("sequelize");

// connexion à la base de donnée
const database = new Sequelize(env.DB_NAME, env.DB_USERNAME, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: env.DB_DIALECT,
});

// vérification de la connexion à la base de donnée
(async () => {
  try {
    await database.authenticate();
    console.log("Connexion à la base de donnée réalisée avec succès.");
  } catch (error) {
    console.error("Impossibilité de se connecter à la base de donnée :", error);
  }
})();

// synchonisation de la base de données
(async () => {
  try {
    await database.sync();
    console.log("La base de donnée a été synchronisée.");
  } catch (error) {
    console.error(
      "Echec lors de la synchronisation de la base de donnée :",
      error
    );
  }
})();

module.exports = database;
